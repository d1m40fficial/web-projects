import { clamp, prefersReducedMotion, rand } from './dom';

/** Starfield + occasional shooting stars behind the whole site. */
export function initScene(): void {
  const canvas = document.getElementById('scene-stars') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  interface Star {
    x: number;
    y: number;
    r: number;
    alpha: number;
    phase: number;
    speed: number;
    hue: string;
  }

  let stars: Star[] = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let raf = 0;
  let running = true;
  let last = performance.now();
  let shooting: { x: number; y: number; vx: number; vy: number; life: number; max: number } | null = null;
  let nextShooting = performance.now() + rand(3000, 7000);
  const reduced = prefersReducedMotion();

  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.round(clamp((width * height) / 12000, 60, 220));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: rand(0.35, 1.35),
      alpha: rand(0.18, 0.85),
      phase: rand(0, Math.PI * 2),
      speed: rand(0.25, 1.1),
      hue: Math.random() > 0.82 ? '#a9d8ff' : Math.random() > 0.75 ? '#c9b6ff' : '#ffffff',
    }));
    if (reduced) draw(performance.now());
  };

  const draw = (now: number) => {
    ctx.clearRect(0, 0, width, height);
    const t = now / 1000;

    for (const s of stars) {
      const twinkle = reduced ? 1 : 0.65 + Math.sin(t * s.speed + s.phase) * 0.35;
      ctx.globalAlpha = clamp(s.alpha * twinkle, 0, 1);
      ctx.fillStyle = s.hue;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      if (s.r > 1.05) {
        ctx.globalAlpha = 0.16 * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (!reduced) {
      if (!shooting && now > nextShooting) {
        shooting = {
          x: rand(width * 0.15, width * 0.85),
          y: rand(0, height * 0.35),
          vx: rand(4.5, 7.5),
          vy: rand(1.6, 3),
          life: 0,
          max: rand(38, 62),
        };
      }
      if (shooting) {
        shooting.x += shooting.vx;
        shooting.y += shooting.vy;
        shooting.life += 1;
        const fade = 1 - shooting.life / shooting.max;
        const tailX = shooting.x - shooting.vx * 9;
        const tailY = shooting.y - shooting.vy * 9;
        const grad = ctx.createLinearGradient(tailX, tailY, shooting.x, shooting.y);
        grad.addColorStop(0, 'rgba(180,220,255,0)');
        grad.addColorStop(0.7, `rgba(190,230,255,${0.5 * fade})`);
        grad.addColorStop(1, `rgba(255,255,255,${0.9 * fade})`);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(shooting.x, shooting.y);
        ctx.stroke();
        if (shooting.life >= shooting.max || shooting.x > width + 40) {
          shooting = null;
          nextShooting = now + rand(5000, 13000);
        }
      }
    }

    ctx.globalAlpha = 1;
  };

  const loop = (now: number) => {
    const dt = Math.min(48, now - last);
    last = now;
    // keep the loop at ~40fps — enough for a background, lighter on laptops
    if (dt > 20 || reduced) {
      draw(now);
      last = now;
    }
    if (running) raf = requestAnimationFrame(loop);
  };

  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(raf);
    }
  });

  if (!reduced) raf = requestAnimationFrame(loop);
}

/** Soft glow that follows the cursor on fine pointers. */
export function initCursor(): void {
  const glow = document.getElementById('cursor-glow');
  if (!glow || !matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let x = targetX;
  let y = targetY;
  let active = false;

  window.addEventListener(
    'pointermove',
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!active) {
        active = true;
        glow.style.opacity = '1';
      }
    },
    { passive: true },
  );

  document.addEventListener('pointerleave', () => {
    glow.style.opacity = '0';
    active = false;
  });

  const tick = () => {
    x += (targetX - x) * 0.12;
    y += (targetY - y) * 0.12;
    glow.style.transform = `translate3d(${x - 190}px, ${y - 190}px, 0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
