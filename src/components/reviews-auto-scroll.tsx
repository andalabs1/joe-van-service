'use client';

import {useEffect} from 'react';

export function ReviewsAutoScroll({
  targetId,
  intervalMs = 4500
}: {
  targetId: string;
  intervalMs?: number;
}) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    // Respect users who prefer reduced motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let paused = false;
    let timer: number | null = null;

    const step = () => {
      const first = el.querySelector(':scope > *') as HTMLElement | null;
      const gap = Number.parseFloat(getComputedStyle(el).columnGap || '0') || 0;
      const amount = first ? first.offsetWidth + gap : Math.min(el.clientWidth * 0.85, 400);
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 12;
      if (atEnd) {
        el.scrollTo({left: 0, behavior: 'smooth'});
      } else {
        el.scrollBy({left: amount, behavior: 'smooth'});
      }
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => {
        if (!paused && document.visibilityState === 'visible') step();
      }, intervalMs);
    };
    const stop = () => {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };

    el.addEventListener('pointerenter', pause);
    el.addEventListener('pointerleave', resume);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', resume);
    el.addEventListener('touchstart', pause, {passive: true});
    el.addEventListener('touchend', resume);
    start();

    return () => {
      stop();
      el.removeEventListener('pointerenter', pause);
      el.removeEventListener('pointerleave', resume);
      el.removeEventListener('focusin', pause);
      el.removeEventListener('focusout', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
    };
  }, [targetId, intervalMs]);

  return null;
}
