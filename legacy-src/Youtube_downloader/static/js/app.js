const $ = (id) => document.getElementById(id);

let currentJobId = null;
let pollTimer = null;

$("url-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  hideAlert();
  const btn = $("fetch-btn");
  btn.disabled = true;
  try {
    const res = await fetch("/api/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: $("url").value.trim() }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Не удалось получить данные о видео");
    renderInfo(data);
  } catch (err) {
    showAlert(err.message);
  } finally {
    btn.disabled = false;
  }
});

function renderInfo(info) {
  $("video-card").classList.remove("hidden");
  $("options").classList.remove("hidden");
  $("thumb").src = info.thumbnail || "";
  $("title").textContent = info.title || "";
  $("channel").textContent = info.uploader || "";
  const parts = [];
  if (info.duration) parts.push("Длительность: " + info.duration);
  if (info.views) parts.push("Просмотров: " + info.views);
  $("stats").textContent = parts.join(" • ");

  const qGrid = $("quality-grid");
  qGrid.innerHTML = "";
  (info.video_options || []).forEach((opt) => {
    const b = document.createElement("button");
    b.className = "opt";
    b.type = "button";
    const label = document.createElement("span");
    label.textContent = opt.label;
    b.appendChild(label);
    if (!info.has_ffmpeg) {
      const s = document.createElement("small");
      s.textContent = "видео + звук";
      b.appendChild(s);
    }
    b.addEventListener("click", () => startJob("video", opt.quality));
    qGrid.appendChild(b);
  });
  if (!(info.video_options || []).length) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = info.has_ffmpeg
      ? "Видео-дорожки недоступны для этого видео"
      : "Выбор качества недоступен: установите FFmpeg и перезапустите сервер";
    qGrid.appendChild(p);
  }

  const aGrid = $("audio-grid");
  aGrid.innerHTML = "";
  const audioBtn = document.createElement("button");
  audioBtn.className = "opt audio";
  audioBtn.type = "button";
  const al = document.createElement("span");
  al.textContent = "Оригинал";
  audioBtn.appendChild(al);
  const as = document.createElement("small");
  as.textContent = info.audio_bitrate ? `до ${info.audio_bitrate} kbps` : "лучший битрейт";
  audioBtn.appendChild(as);
  audioBtn.addEventListener("click", () => startJob("audio", null));
  aGrid.appendChild(audioBtn);

  if (info.has_ffmpeg) {
    const mp3Btn = document.createElement("button");
    mp3Btn.className = "opt audio";
    mp3Btn.type = "button";
    const ml = document.createElement("span");
    ml.textContent = "MP3";
    mp3Btn.appendChild(ml);
    const ms = document.createElement("small");
    ms.textContent = "320 kbps";
    mp3Btn.appendChild(ms);
    mp3Btn.addEventListener("click", () => startJob("mp3", null));
    aGrid.appendChild(mp3Btn);
  } else {
    const note = document.createElement("p");
    note.className = "muted";
    note.textContent = "Для качеств выше 720p и MP3 установите FFmpeg и перезапустите сервер.";
    aGrid.appendChild(note);
  }
}

async function startJob(mode, quality) {
  stopPolling();
  hideAlert();
  try {
    const res = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: $("url").value.trim(), mode, quality }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Не удалось запустить загрузку");
    currentJobId = data.job_id;
    showProgress();
    pollTimer = setInterval(() => pollStatus(currentJobId), 500);
  } catch (err) {
    showAlert(err.message);
  }
}

function pollStatus(id) {
  fetch("/api/status/" + id)
    .then((r) => r.json())
    .then((job) => {
      if (id !== currentJobId) return;
      $("stage").textContent = job.stage || job.status;
      const pct = Math.min(100, Number(job.percent) || 0);
      $("percent").textContent = pct.toFixed(0) + "%";
      $("fill").style.width = pct + "%";
      if (job.status === "done") {
        stopPolling();
        triggerDownload(id);
      } else if (job.status === "error") {
        stopPolling();
        hideProgress();
        showAlert(job.error || "Ошибка загрузки");
      }
    })
    .catch(() => {});
}

function triggerDownload(id) {
  const a = document.createElement("a");
  a.href = "/api/file/" + id;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(hideProgress, 4000);
}

function showProgress() {
  $("progress-panel").classList.remove("hidden");
  $("stage").textContent = "Подготовка…";
  $("percent").textContent = "0%";
  $("fill").style.width = "0%";
}

function hideProgress() {
  $("progress-panel").classList.add("hidden");
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

function showAlert(msg) {
  const el = $("alert");
  el.textContent = msg;
  el.classList.remove("hidden");
}

function hideAlert() {
  $("alert").classList.add("hidden");
}
