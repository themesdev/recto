// Reveal on scroll: one IntersectionObserver marks each .s-reveal with data-revealed when it enters the view. It marks
// the page first (data-reveal-ready), so without this script nothing is ever hidden. sections.css does the rest.
export function initReveal(root: Document = document) {
  const html = root.documentElement;
  if (html.hasAttribute('data-reveal-ready') || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries)
        if (e.isIntersecting) {
          e.target.setAttribute('data-revealed', '');
          io.unobserve(e.target);
        }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  // Whatever is in view already shows at once: only what is below the fold waits.
  for (const el of root.querySelectorAll('.s-reveal')) {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) el.setAttribute('data-revealed', '');
    else io.observe(el);
  }
  html.setAttribute('data-reveal-ready', '');
}

// Glow: moves the spotlight of the .s-glow under the pointer (--glow-x, --glow-y). One listener for the page.
export function initGlow(root: Document = document) {
  if ((root as Document & { __glow?: boolean }).__glow) return;
  (root as Document & { __glow?: boolean }).__glow = true;
  root.addEventListener(
    'pointermove',
    (e) => {
      const el = (e.target as Element | null)?.closest?.('.s-glow') as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--glow-x', `${e.clientX - r.left}px`);
      el.style.setProperty('--glow-y', `${e.clientY - r.top}px`);
    },
    { passive: true },
  );
}

// Marquee: the pause buttons (data-marquee-pause) stop and restart their rail.
export function initMarquee(root: Document = document) {
  if ((root as Document & { __marquee?: boolean }).__marquee) return;
  (root as Document & { __marquee?: boolean }).__marquee = true;
  root.addEventListener('click', (e) => {
    const button = (e.target as Element).closest('[data-marquee-pause]');
    if (!button || button.closest('[data-section="logos"]')) return;
    const paused = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(paused));
    button.closest('[data-marquee]')?.toggleAttribute('data-paused', paused);
  });
}
