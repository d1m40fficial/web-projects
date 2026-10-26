import { $$, countUp, prefersReducedMotion } from './dom';

let revealObserver: IntersectionObserver | null = null;
let counterObserver: IntersectionObserver | null = null;

function ensureObservers(): void {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const node = entry.target as HTMLElement;
          node.classList.add('is-in');
          revealObserver?.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
  }
  if (!counterObserver) {
    counterObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const node = entry.target as HTMLElement;
          const target = Number(node.dataset.count ?? 0);
          countUp(node, target, {
            decimals: Number(node.dataset.decimals ?? 0),
            suffix: node.dataset.suffix ?? '',
            duration: 1600,
          });
          counterObserver?.unobserve(node);
        }
      },
      { threshold: 0.5 },
    );
  }
}

export function observeReveals(root: ParentNode = document): void {
  ensureObservers();
  const nodes = $$<HTMLElement>('.reveal', root);
  if (prefersReducedMotion()) {
    nodes.forEach((n) => n.classList.add('is-in'));
    return;
  }
  nodes.forEach((node, index) => {
    if (!node.style.getPropertyValue('--d')) {
      node.style.setProperty('--d', `${Math.min(index * 55, 440)}ms`);
    }
    revealObserver?.observe(node);
  });
}

export function observeCounters(root: ParentNode = document): void {
  ensureObservers();
  $$<HTMLElement>('[data-count]', root).forEach((node) => {
    if (prefersReducedMotion()) {
      node.textContent = Number(node.dataset.count).toFixed(Number(node.dataset.decimals ?? 0)) + (node.dataset.suffix ?? '');
      return;
    }
    counterObserver?.observe(node);
  });
}

/** 3D tilt + spotlight for cards that opt in with [data-tilt]. */
export function bindTilt(root: ParentNode = document): void {
  if (!matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;
  $$<HTMLElement>('[data-tilt]', root).forEach((card) => {
    if (card.dataset.tiltBound === '1') return;
    card.dataset.tiltBound = '1';

    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      card.style.setProperty('--rx', `${((0.5 - py) * 4).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${((px - 0.5) * 5).toFixed(2)}deg`);
      card.classList.add('is-tilting');
    });

    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });
  });
}

export function initScrollFx(): void {
  const nav = document.getElementById('nav');
  const bar = document.getElementById('scroll-progress-bar');

  const update = () => {
    const y = window.scrollY;
    nav?.classList.toggle('is-scrolled', y > 24);
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, y / max) : 0;
      bar.style.width = `${(progress * 100).toFixed(2)}%`;
    }
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

export function ambientParallax(): void {
  if (prefersReducedMotion() || !matchMedia('(pointer: fine)').matches) return;
  const orbs = $$<HTMLElement>('.scene__orb');
  const stage = document.querySelector<HTMLElement>('[data-parallax]');

  window.addEventListener(
    'pointermove',
    (event) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      orbs.forEach((orb, i) => {
        const force = (i + 1) * 9;
        orb.style.translate = `${(-nx * force).toFixed(1)}px ${(-ny * force).toFixed(1)}px`;
      });
      if (stage) {
        stage.style.setProperty('--px', `${(nx * -6).toFixed(2)}deg`);
        stage.style.setProperty('--py', `${(ny * 5).toFixed(2)}deg`);
      }
    },
    { passive: true },
  );
}
