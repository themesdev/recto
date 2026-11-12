'use client';
// A light/dark switch (../ThemeSwitch.astro): a toggle button (aria-pressed true while dark) that sets data-theme on
// <html> and remembers it. Put THEME_INIT in <head> as well, so a saved choice applies before the first paint.
import { useEffect, useState } from 'react';
import { Icon } from '../../icon/react/Icon';
import { THEME_SWITCH_LABEL, isDarkNow, setTheme, themeSwitchClasses } from '../shared';

export function ThemeSwitch({ className }: { className?: string }) {
  const c = themeSwitchClasses(className);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setDark(isDarkNow());
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return (
    <button
      type="button"
      className={c.button}
      aria-pressed={dark}
      data-theme-switch=""
      onClick={() => {
        setTheme(dark ? 'light' : 'dark');
        setDark(!dark);
      }}
    >
      <span className="sr-only">{THEME_SWITCH_LABEL}</span>
      <Icon name="moon" size={20} className={c.moon} />
      <Icon name="sun" size={20} className={c.sun} />
    </button>
  );
}
