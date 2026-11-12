'use client';
// The effects' few lines of JavaScript (../reveal.ts): reveal on scroll, the glow's pointer, the marquee's pause. Once
// per page; every effect works and reads without it. Renders nothing.
import { useEffect } from 'react';
import { initGlow, initMarquee, initReveal } from '../reveal';

export function EffectsInit() {
  useEffect(() => {
    initReveal();
    initGlow();
    initMarquee();
  }, []);
  return null;
}
