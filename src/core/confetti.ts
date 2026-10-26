import { prefersReducedMotion } from './dom';

/** Lightweight confetti burst, no dependencies. */
export function fireConfetti(count = 140): void {
  if (prefersReducedMotion()) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const colors = ['#8b6bff', '#38e0f2', '#c4f56a', '#ffcb5c', '#ff6aa8', '#ffffff'];
  const pieces = Array.from({ length: count }, () => ({
    x: width * (0.3 + Math.random() * 0.4),
    y: height * (0.28 + Math.random() * 0.1),
    vx: (Math.random() - 0.5) * 9,
    vy: -Math.random() * 9 - 3,
    size: 4 + Math.random() * 7,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.3,
    shape: Math.random() > 0.55 ? 'rect' : 'circle',
  }));

  const started = performance.now();
  let raf = 0;

  const frame = (now: number) => {
    const elapsed = now - started;
    if (elapsed > 3200) {
      canvas.remove();
      return;
    }
    ctx.clearRect(0, 0, width, height);
    const fade = elapsed > 2400 ? 1 - (elapsed - 2400) / 800 : 1;
    for (const p of pieces) {
      p.vy += 0.22;
      p.vx *= 0.995;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, fade);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.38, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    raf = requestAnimationFrame(frame);
  };

  raf = requestAnimationFrame(frame);
  canvas.addEventListener('click', () => {
    cancelAnimationFrame(raf);
    canvas.remove();
  });
}
