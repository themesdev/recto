'use client';
// Site header (item.json): brand, navigation and buttons; below 1024px the navigation and buttons fold into a menu.
import { useEffect, useRef, useState } from 'react';
import { Actions } from '../../../../parts/actions/react/Actions';
import { Brand } from '../../../../parts/brand/react/Brand';
import { Icon } from '../../../../parts/icon/react/Icon';
import { ThemeSwitch } from '../../../../parts/theme-switch/react/ThemeSwitch';
import { toneAttr } from '../../../../parts/kinds';
import { cn } from '../../../../recipes/cn';
import { headerClasses } from '../shared';
import { HEADER_DEFAULTS, type HeaderContent } from '../types';

export interface HeaderProps extends HeaderContent {
  currentPath?: string;
  sticky?: boolean;
  /** A light/dark switch at the end of the bar (parts/theme-switch; put THEME_INIT in <head>). */
  themeSwitch?: boolean;
  id?: string;
  className?: string;
}

export function Header({ brand, links, actions, variant, tone, currentPath, sticky = true, themeSwitch = false, id, className }: HeaderProps) {
  const v = variant ?? HEADER_DEFAULTS.variant;
  const c = headerClasses(v, sticky);
  const menuId = `${id ?? 'site-header'}-menu`;
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  // Escape closes the open menu and returns focus to the toggle (as the Astro script does, from anywhere on the page).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggle.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header id={id} data-section="header" data-variant={v} data-tone={toneAttr(tone)} className={cn(c.root, className)} data-header="">
      <a href="#main" className={c.skip}>Skip to content</a>
      <div className={c.bar}>
        <div className={c.brand}><Brand {...brand} /></div>
        <button ref={toggle} type="button" className={c.toggle} aria-expanded={open} aria-controls={menuId} data-header-toggle="" onClick={() => setOpen(!open)}>
          <Icon name="menu" size={20} className="group-aria-expanded:hidden" />
          <Icon name="x" size={20} className="hidden group-aria-expanded:block" />
          <span>Menu</span>
        </button>
        <div
          id={menuId}
          className={c.menu}
          data-header-menu=""
          data-open={open ? '' : undefined}
          onClick={(e) => {
            if ((e.target as Element).closest('a')) setOpen(false);
          }}
        >
          {links?.length ? (
            <nav aria-label="Main" className={c.nav}>
              <ul role="list" className={c.list}>
                {links.map((l, i) => (
                  <li key={i}>
                    <a href={l.href} className={c.link} aria-current={l.href === currentPath ? 'page' : undefined}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          <Actions actions={actions} className={c.actions} />
        </div>
        {themeSwitch ? <ThemeSwitch className={c.theme} /> : null}
      </div>
    </header>
  );
}
