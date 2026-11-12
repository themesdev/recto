// The light/dark switch (Header's themeSwitch). The tokens already answer to data-theme on <html> ('light' or 'dark')
// and to the system setting when it is absent; the switch sets data-theme and remembers the choice.
import { cn } from '../../recipes/cn';

/** Where the choice is kept. */
export const THEME_STORAGE_KEY = 'theme';

/**
 * Put this in <head>, inline and before the stylesheet if you can, so a saved choice applies before the first paint
 * (no flash of the other theme). Astro: <script is:inline set:html={THEME_INIT} />. Next.js: a <script> with
 * dangerouslySetInnerHTML in the root layout, and suppressHydrationWarning on <html>.
 */
export const THEME_INIT = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

/** Is the page dark now: the saved choice, or else the system setting. */
export const isDarkNow = () => {
  const t = document.documentElement.dataset.theme;
  return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
};

/** Apply and remember a choice. */
export const setTheme = (theme: 'light' | 'dark') => {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode or storage off: the choice holds for this page only.
  }
};

/** A 44px icon button; the moon while light, the sun while dark. */
export const themeSwitchClasses = (className?: string) => ({
  button: cn(
    's-press group inline-flex size-11 shrink-0 items-center justify-center rounded-button text-muted-foreground on-hover:text-foreground on-press:bg-foreground/10',
    className,
  ),
  moon: 'group-aria-pressed:hidden',
  sun: 'hidden group-aria-pressed:block',
});

/** The button's name; its state is aria-pressed (true while dark). */
export const THEME_SWITCH_LABEL = 'Dark mode';
