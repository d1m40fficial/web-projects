import datetime
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(ROOT, "public")
PROGRESS_FILE = os.path.join(ROOT, "progress.json")

MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon",
}

DEFAULT_PROGRESS = {
    "credits": 0,
    "best": 0,
    "totalRuns": 0,
    "upgrades": {"fireRate": 0, "damage": 0, "speed": 0, "hull": 0, "magnet": 0},
}


def sanitize(raw):
    try:
        raw = json.loads(raw)
    except (ValueError, TypeError):
        return None
    if not isinstance(raw, dict):
        return None

    def num(v, cap=10**9):
        try:
            v = float(v)
        except (ValueError, TypeError):
            return 0
        if v != v or v in (float("inf"), float("-inf")) or v < 0:
            return 0
        return min(v, cap)

    upgrades = raw.get("upgrades")
    if not isinstance(upgrades, dict):
        upgrades = {}
    return {
        "credits": num(raw.get("credits")),
        "best": num(raw.get("best")),
        "totalRuns": min(num(raw.get("totalRuns")), 10**6),
        "upgrades": {k: min(num(upgrades.get(k)), 999) for k in DEFAULT_PROGRESS["upgrades"]},
        "savedAt": datetime.datetime.now().isoformat(timespec="seconds"),
    }


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def _send(self, code, body, ctype):
        data = body if isinstance(body, bytes) else body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/progress":
            try:
                with open(PROGRESS_FILE, encoding="utf-8") as f:
                    self._send(200, f.read(), MIME[".json"])
            except OSError:
                self._send(200, "null", MIME[".json"])
            return
        self._serve_static(path)

    def do_POST(self):
        if urlparse(self.path).path != "/api/progress":
            self._send(404, "not found", "text/plain")
            return
        length = int(self.headers.get("Content-Length") or 0)
        if length > 65536:
            self._send(413, "too large", "text/plain")
            return
        obj = sanitize(self.rfile.read(length).decode("utf-8"))
        if obj is None:
            self._send(400, '{"ok":false}', MIME[".json"])
            return
        tmp = PROGRESS_FILE + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, indent=2)
        os.replace(tmp, PROGRESS_FILE)
        self._send(200, '{"ok":true}', MIME[".json"])

    def _serve_static(self, path):
        rel = os.path.normpath(path).lstrip("\\/").replace("/", os.sep)
        full = os.path.normpath(os.path.join(PUBLIC_DIR, rel))
        if not (full == PUBLIC_DIR or full.startswith(PUBLIC_DIR + os.sep)):
            self._send(403, "forbidden", "text/plain")
            return
        if not os.path.isfile(full):
            full = os.path.join(PUBLIC_DIR, "index.html")
        ext = os.path.splitext(full)[1].lower()
        try:
            with open(full, "rb") as f:
                self._send(200, f.read(), MIME.get(ext, "application/octet-stream"))
        except OSError:
            self._send(404, "not found", "text/plain")

    def log_message(self, fmt, *args):
        pass


def main():
    port = int(os.environ.get("PORT") or 3000)
    if not os.path.isfile(PROGRESS_FILE):
        with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
            json.dump(DEFAULT_PROGRESS, f, ensure_ascii=False, indent=2)
    srv = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"SUPER SPACE CLUB // web  ->  http://localhost:{port}")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
