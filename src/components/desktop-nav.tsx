'use client';

import Image from 'next/image';
import {useCallback, useState} from 'react';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {AnchorIcon, ChevronDownIcon, CompassIcon, HomeIcon, SunriseIcon, SunsetIcon} from './icons';

export type DesktopSubLink = {href: string; label: string; image?: string; iconName?: string};
export type DesktopNavLink = {href: string; label: string; children?: DesktopSubLink[]};

const desktopIcons: Record<string, typeof HomeIcon> = {
  metropolitan: HomeIcon,
  east: SunriseIcon,
  west: SunsetIcon,
  'north-northeast': CompassIcon,
  south: AnchorIcon
};

function DesktopChildVisual({child}: {child: DesktopSubLink}) {
  if (child.image) {
    return (
      <span className="submenu-thumb" aria-hidden="true">
        <Image src={child.image} alt="" width={64} height={44} />
      </span>
    );
  }
  const Icon = child.iconName ? desktopIcons[child.iconName] : undefined;
  if (Icon) {
    return (
      <span className="submenu-icon" aria-hidden="true">
        <Icon />
      </span>
    );
  }
  return null;
}

export function DesktopNav({locale, links}: {locale: Locale; links: DesktopNavLink[]}) {
  // Href of the parent whose submenu was just clicked. While set, CSS forces
  // that submenu hidden even though :hover / :focus-within still match.
  const [dismissed, setDismissed] = useState<string | null>(null);

  const hideSubmenu = useCallback((parentHref: string, target: HTMLElement) => {
    setDismissed(parentHref);
    // Drop :focus-within so keyboard focus doesn't keep it open.
    const active = document.activeElement as HTMLElement | null;
    active?.blur?.();
    target.blur?.();
  }, []);

  return (
    <nav className="desktop-nav" aria-label="Main navigation">
      <ul className="desktop-nav-list">
        {links.map((link) => (
          <li
            key={link.href}
            className={
              link.children
                ? dismissed === link.href
                  ? 'nav-item has-submenu is-dismissed'
                  : 'nav-item has-submenu'
                : 'nav-item'
            }
            onMouseLeave={() => {
              if (dismissed === link.href) setDismissed(null);
            }}
          >
            <Link
              href={link.href}
              locale={locale}
              className="nav-link"
              aria-haspopup={link.children ? 'true' : undefined}
              onClick={(event) => {
                if (link.children) hideSubmenu(link.href, event.currentTarget);
              }}
            >
              {link.label}
              {link.children && <ChevronDownIcon />}
            </Link>
            {link.children && (
              <ul className="submenu" aria-label={link.label}>
                {link.children.map((child) => (
                  <li key={`${child.href}-${child.label}`}>
                    <Link
                      href={child.href}
                      locale={locale}
                      onClick={(event) => hideSubmenu(link.href, event.currentTarget)}
                    >
                      <DesktopChildVisual child={child} />
                      <span>{child.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
