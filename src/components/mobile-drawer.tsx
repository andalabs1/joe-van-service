'use client';

import Image from 'next/image';
import {Suspense, useCallback, useEffect, useState} from 'react';
import {FiX} from 'react-icons/fi';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {LocaleSwitcher} from './locale-switcher';
import {
  AnchorIcon,
  ChevronDownIcon,
  CompassIcon,
  HomeIcon,
  MenuIcon,
  SunriseIcon,
  SunsetIcon,
} from './icons';

export type DrawerSubLink = {href: string; label: string; image?: string; iconName?: string};
export type DrawerLink = {href: string; label: string; children?: DrawerSubLink[]};

const drawerIcons: Record<string, typeof HomeIcon> = {
  metropolitan: HomeIcon,
  east: SunriseIcon,
  west: SunsetIcon,
  'north-northeast': CompassIcon,
  south: AnchorIcon
};

function DrawerChildVisual({child}: {child: DrawerSubLink}) {
  if (child.image) {
    return (
      <span className="submenu-thumb" aria-hidden="true">
        <Image src={child.image} alt="" width={64} height={44} />
      </span>
    );
  }
  const Icon = child.iconName ? drawerIcons[child.iconName] : undefined;
  if (Icon) {
    return (
      <span className="submenu-icon" aria-hidden="true">
        <Icon />
      </span>
    );
  }
  return null;
}

export function MobileDrawer({
  locale,
  links,
  bookingLabel,
  languageLabels,
  menuLabel,
  closeLabel
}: {
  locale: Locale;
  links: DrawerLink[];
  bookingLabel: string;
  languageLabels: {th: string; en: string; aria: string};
  menuLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setExpanded(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  return (
    <div className="mobile-drawer">
      <button
        type="button"
        className="drawer-trigger"
        aria-label={menuLabel}
        aria-expanded={open}
        aria-controls="mobile-drawer-panel"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </button>
      <div
        className={open ? 'drawer-overlay is-open' : 'drawer-overlay'}
        aria-hidden={!open}
        onClick={close}
      />
      <aside
        id="mobile-drawer-panel"
        className={open ? 'drawer-panel is-open' : 'drawer-panel'}
        role="dialog"
        aria-modal="true"
        aria-label={menuLabel}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="drawer-header">
          <Suspense fallback={null}>
            <LocaleSwitcher locale={locale} labels={languageLabels} />
          </Suspense>
          <button type="button" className="drawer-close" aria-label={closeLabel} onClick={close}>
            <FiX aria-hidden="true" focusable="false" />
          </button>
        </div>
        <nav className="drawer-nav" aria-label={menuLabel}>
          {links.map((link) => link.children ? (
            <div key={link.href} className={expanded === link.href ? 'drawer-group is-expanded' : 'drawer-group'}>
              <button
                type="button"
                className="drawer-group-toggle"
                aria-expanded={expanded === link.href}
                onClick={() => setExpanded((current) => (current === link.href ? null : link.href))}
              >
                <span>{link.label}</span>
                <ChevronDownIcon />
              </button>
              <div className="drawer-group-links">
                <Link href={link.href} locale={locale} className="drawer-overview" onClick={close}>
                  {link.label}
                </Link>
                {link.children.map((child) => (
                  <Link key={`${child.href}-${child.label}`} href={child.href} locale={locale} onClick={close}>
                    <DrawerChildVisual child={child} />
                    <span>{child.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link key={link.href} href={link.href} locale={locale} className="drawer-link" onClick={close}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="drawer-footer">
          <Link href="/booking" locale={locale} className="button button-accent" onClick={close}>
            {bookingLabel}
          </Link>
        </div>
      </aside>
    </div>
  );
}
