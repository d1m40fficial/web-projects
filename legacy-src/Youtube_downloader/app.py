import re
import shutil
import threading
import time
import uuid
from pathlib import Path

import yt_dlp
from flask import Flask, abort, after_this_request, jsonify, render_template, request, send_file

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
DOWNLOAD_DIR = BASE_DIR / "downloads"
DOWNLOAD_DIR.mkdir(exist_ok=True)

JOBS = {}
JOBS_LOCK = threading.Lock()
FILE_TTL = 3600

PROBE_CACHE = {}
PROBE_LOCK = threading.Lock()
PROBE_TTL = 300

CLIENT_CHAINS = [
    None,
    ["web_safari"],
    ["web_embedded"],
    ["android"],
    ["mweb"],
]


def has_ffmpeg():
    return shutil.which("ffmpeg") is not None


def find_js_runtime():
    deno_bundled = BASE_DIR / "bin" / "deno.exe"
    if shutil.which("deno"):
        return {"deno": {}}
    if deno_bundled.is_file():
        return {"deno": {"path": str(deno_bundled)}}
    if shutil.which("node"):
        return {"node": {}}
    for qjs in ("qjs", "qjs.exe"):
        if shutil.which(qjs):
            return {"quickjs": {}}
    return None


def fmt_duration(seconds):
    seconds = int(seconds or 0)
    h, rem = divmod(seconds, 3600)
    m, s = divmod(rem, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def fmt_views(count):
    return f"{count:,}".replace(",", " ") if count else ""


def sanitize_name(name):
    name = re.sub(r'[\\/:*?"<>|]+', "_", name or "").strip()
    return name[:120] or "youtube_video"


def base_ydl_opts():
    opts = {
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "socket_timeout": 20,
    }
    runtime = find_js_runtime()
    if runtime:
        opts["js_runtimes"] = runtime
    return opts


def score_formats(info):
    fmts = info.get("formats") or []
    heights = [f.get("height") or 0 for f in fmts if f.get("vcodec") not in (None, "none")]
    progressive = any(
        f.get("acodec") not in (None, "none")
        for f in fmts if f.get("vcodec") not in (None, "none")
    )
    return (max(heights, default=0), len(fmts), progressive)


def choose_client_chain(url):
    with PROBE_LOCK:
        cached = PROBE_CACHE.get(url)
        if cached and time.time() - cached["ts"] < PROBE_TTL:
            return cached["chain"], cached["info"]

    last_error = None
    best = None
    for chain in CLIENT_CHAINS:
        opts = base_ydl_opts()
        opts["skip_download"] = True
        if chain:
            opts["extractor_args"] = {"youtube": {"player_client": chain}}
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(url, download=False)
        except Exception as e:
            last_error = e
            continue
        score = score_formats(info)
        if best is None or score > best["score"]:
            best = {"chain": chain, "info": info, "score": score}
        if score[0] >= 720:
            break

    if best is None:
        msg = str(last_error)
        if "Sign in" in msg or "age" in msg.lower():
            msg = "Видео недоступно (возможны возрастные ограничения или приватность)"
        raise RuntimeError(f"Не удалось получить данные: {msg[:300]}")

    with PROBE_LOCK:
        PROBE_CACHE[url] = {"ts": time.time(), "chain": best["chain"], "info": best["info"]}
    return best["chain"], best["info"]


@app.route("/")
def index():
    return render_template("index.html", has_ffmpeg=has_ffmpeg())


@app.post("/api/info")
def api_info():
    data = request.get_json(silent=True) or {}
    url = (data.get("url") or "").strip()
    if not url:
        return jsonify({"error": "Укажите ссылку на видео"}), 400

    try:
        _, info = choose_client_chain(url)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    ffmpeg = has_ffmpeg()
    heights = {}
    for f in info.get("formats") or []:
        h = f.get("height")
        if not h or f.get("vcodec") in (None, "none"):
            continue
        rec = heights.setdefault(h, {"fps": 0, "progressive": False})
        rec["fps"] = max(rec["fps"], int(f.get("fps") or 0))
        if f.get("acodec") not in (None, "none"):
            rec["progressive"] = True

    video_options = []
    for h in sorted(heights, reverse=True):
        rec = heights[h]
        if not ffmpeg and not rec["progressive"]:
            continue
        label = f"{h}p"
        if rec["fps"] > 30:
            label += str(rec["fps"])
        video_options.append({"quality": str(h), "label": label})

    audio_formats = [
        f for f in info.get("formats") or []
        if f.get("vcodec") in (None, "none") and f.get("acodec") not in (None, "none")
    ]
    abr = None
    if audio_formats:
        best = max(audio_formats, key=lambda f: f.get("abr") or f.get("tbr") or 0)
        if best.get("abr"):
            abr = round(best["abr"])

    return jsonify({
        "title": info.get("title"),
        "uploader": info.get("uploader"),
        "duration": fmt_duration(info.get("duration")),
        "views": fmt_views(info.get("view_count")),
        "thumbnail": info.get("thumbnail"),
        "video_options": video_options,
        "audio_bitrate": abr,
        "has_ffmpeg": ffmpeg,
    })


def build_ydl_opts(job_id, mode, quality, chain):
    outtmpl = str(DOWNLOAD_DIR / f"{job_id}.%(ext)s")
    opts = {
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "outtmpl": outtmpl,
        "socket_timeout": 30,
        "retries": 3,
        "concurrent_fragment_downloads": 4,
        "progress_hooks": [make_progress_hook(job_id)],
    }
    runtime = find_js_runtime()
    if runtime:
        opts["js_runtimes"] = runtime
    if chain:
        opts["extractor_args"] = {"youtube": {"player_client": chain}}
    if mode == "mp3":
        opts["format"] = "bestaudio/best"
        opts["postprocessors"] = [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "320",
        }]
    elif mode == "audio":
        opts["format"] = "bestaudio/best"
    else:
        h = int(quality)
        opts["format"] = f"bestvideo[height<={h}]+bestaudio/best[height<={h}]/best"
        if has_ffmpeg():
            opts["merge_output_format"] = "mp4"
    return opts


def make_progress_hook(job_id):
    def hook(d):
        with JOBS_LOCK:
            job = JOBS.get(job_id)
            if job is None:
                return
            if d["status"] == "downloading":
                job["stage"] = "Загрузка…"
                total = d.get("total_bytes") or d.get("total_bytes_estimate")
                done = d.get("downloaded_bytes") or 0
                if total:
                    job["percent"] = round(done / total * 100, 1)
            elif d["status"] == "finished":
                job["stage"] = "Обработка…"
                job["percent"] = 100.0
    return hook


def run_job(job_id, url, mode, quality):
    def set_state(**kwargs):
        with JOBS_LOCK:
            JOBS[job_id].update(kwargs)

    try:
        set_state(status="downloading", stage="Анализ видео…")
        try:
            chain, _ = choose_client_chain(url)
        except Exception:
            chain = None

        set_state(stage="Загрузка…" if mode != "video" else "Загрузка и склейка…")
        opts = build_ydl_opts(job_id, mode, quality, chain)
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=True)
            title = sanitize_name(info.get("title"))

        matches = sorted(DOWNLOAD_DIR.glob(f"{job_id}.*"))
        stored = max(matches, key=lambda p: p.stat().st_mtime)
        ext = stored.suffix.lstrip(".") or "bin"

        if mode == "mp3":
            dl_name = f"{title}.mp3"
        else:
            dl_name = f"{title}.{ext}"

        set_state(status="done", stage="Готово", percent=100.0,
                  stored=stored.name, download_name=dl_name)
    except Exception as e:
        set_state(status="error", error=str(e)[:300])


@app.post("/api/download")
def api_download():
    data = request.get_json(silent=True) or {}
    url = (data.get("url") or "").strip()
    mode = data.get("mode")
    quality = data.get("quality")

    if not url or mode not in ("video", "audio", "mp3"):
        return jsonify({"error": "Некорректный запрос"}), 400
    if mode == "video":
        try:
            int(quality)
        except (TypeError, ValueError):
            return jsonify({"error": "Выберите качество видео"}), 400

    job_id = uuid.uuid4().hex[:12]
    with JOBS_LOCK:
        JOBS[job_id] = {
            "id": job_id,
            "status": "queued",
            "stage": "В очереди…",
            "percent": 0.0,
            "stored": None,
            "download_name": None,
            "error": None,
            "created": time.time(),
        }

    threading.Thread(target=run_job, args=(job_id, url, mode, quality), daemon=True).start()
    return jsonify({"job_id": job_id})


@app.get("/api/status/<job_id>")
def api_status(job_id):
    with JOBS_LOCK:
        job = JOBS.get(job_id)
        if not job:
            return jsonify({"error": "Задача не найдена"}), 404
        return jsonify({k: job[k] for k in ("status", "stage", "percent", "download_name", "error")})


@app.get("/api/file/<job_id>")
def api_file(job_id):
    with JOBS_LOCK:
        job = JOBS.get(job_id)
    if not job or job["status"] != "done" or not job["stored"]:
        abort(404)
    path = DOWNLOAD_DIR / job["stored"]
    if not path.is_file():
        abort(404)

    @after_this_request
    def cleanup_later(response):
        def cleanup():
            time.sleep(15)
            try:
                path.unlink()
            except OSError:
                pass
            with JOBS_LOCK:
                JOBS.pop(job_id, None)
        threading.Thread(target=cleanup, daemon=True).start()
        return response

    return send_file(path, as_attachment=True, download_name=job["download_name"])


def janitor():
    while True:
        time.sleep(600)
        now = time.time()
        with JOBS_LOCK:
            stale = [jid for jid, j in JOBS.items() if now - j["created"] > FILE_TTL]
            for jid in stale:
                JOBS.pop(jid, None)
        with PROBE_LOCK:
            expired = [u for u, c in PROBE_CACHE.items() if now - c["ts"] > PROBE_TTL * 6]
            for u in expired:
                PROBE_CACHE.pop(u, None)
        for p in DOWNLOAD_DIR.iterdir():
            try:
                if now - p.stat().st_mtime > FILE_TTL:
                    p.unlink()
            except OSError:
                pass


if __name__ == "__main__":
    threading.Thread(target=janitor, daemon=True).start()
    ffmpeg = "найден" if has_ffmpeg() else "не найден — MP3 и качество выше 720p будут недоступны"
    js = "deno/node" if find_js_runtime() else "НЕ НАЙДЕН — положите deno.exe в папку bin/"
    print(f"FFmpeg: {ffmpeg}")
    print(f"JS runtime: {js}")
    print("Откройте http://127.0.0.1:8000 в браузере")
    app.run(host="127.0.0.1", port=8000, debug=False, threaded=True)
