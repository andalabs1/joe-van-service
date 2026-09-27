import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {publishedServices} from '@/data/services';
import {vehicleGroups} from '@/data/vehicle-pricing';
import {LocaleSwitcher} from './locale-switcher';
import {Logo} from './logo';
import {
  AnchorIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChevronDownIcon,
  ClockIcon,
  CompassIcon,
  HomeIcon,
  MenuIcon,
  NavigationIcon,
  SendIcon,
  SunriseIcon,
  SunsetIcon,
  UsersIcon
} from './icons';
import type {IconType} from 'react-icons';
import {Suspense} from 'react';

type SubLink = {href: string; label: string; icon?: IconType; image?: string};
type NavLink = {href: string; label: string; children?: SubLink[]};

const serviceIcons: Record<string, IconType> = {
  'van-with-driver': UsersIcon,
  'daily-charter': ClockIcon,
  'airport-transfer': SendIcon,
  'outstation-trip': NavigationIcon,
  'multi-day-trip': CalendarIcon,
  'corporate-transport': BriefcaseIcon
};

const groupImages: Record<string, string> = {
  carSuv: '/model-car-suv.png',
  limousine: '/model-limousine.png',
  mpvVan: '/model-mpv-van.png',
  busCoach: '/model-bus-coach.png'
};

const regionIcons: Record<string, IconType> = {
  metropolitan: HomeIcon,
  east: SunriseIcon,
  west: SunsetIcon,
  'north-northeast': CompassIcon,
  south: AnchorIcon
};

function ChildVisual({child}: {child: SubLink}) {
  if (child.image) {
    return (
      <span className="submenu-thumb" aria-hidden="true">
        <Image src={child.image} alt="" width={64} height={44} />
      </span>
    );
  }
  if (child.icon) {
    const Icon = child.icon;
    return (
      <span className="submenu-icon" aria-hidden="true">
        <Icon />
      </span>
    );
  }
  return null;
}

export async function SiteHeader({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: 'Common'});
  const vehicle = await getTranslations({locale, namespace: 'Vehicle'});
  const bangkok = await getTranslations({locale, namespace: 'Bangkok'});
  const regionLinks: SubLink[] = [
    {value: 'metropolitan', label: bangkok('metropolitan')},
    {value: 'east', label: bangkok('east')},
    {value: 'west', label: bangkok('west')},
    {value: 'north-northeast', label: bangkok('northNortheast')},
    {value: 'south', label: bangkok('south')}
  ].map((region) => ({
    href: `/routes/bangkok?region=${region.value}`,
    label: region.label,
    icon: regionIcons[region.value]
  }));
  const links: NavLink[] = [
    {href: '/', label: t('home')},
    {
      href: '/services-rates',
      label: t('services'),
      children: publishedServices.map((service) => ({
        href: `/services-rates/${service.slug}`,
        label: service.name[locale],
        icon: serviceIcons[service.slug]
      }))
    },
    {
      href: '/vehicles',
      label: t('vehicles'),
      children: vehicleGroups.map((group) => ({
        href: `/vehicles#vehicle-group-${group.key}`,
        label: vehicle(group.key),
        image: groupImages[group.key]
      }))
    },
    {href: '/routes', label: t('routes'), children: regionLinks},
    {href: '/contact', label: t('contact')}
  ];

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo locale={locale} label={t('home')} />
        <nav className="desktop-nav" aria-label="Main navigation">
          <ul className="desktop-nav-list">
            {links.map((link) => (
              <li key={link.href} className={link.children ? 'nav-item has-submenu' : 'nav-item'}>
                <Link
                  href={link.href}
                  locale={locale}
                  className="nav-link"
                  aria-haspopup={link.children ? 'true' : undefined}
                >
                  {link.label}
                  {link.children && <ChevronDownIcon />}
                </Link>
                {link.children && (
                  <ul className="submenu" aria-label={link.label}>
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} locale={locale}>
                          <ChildVisual child={child} />
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
        <div className="header-actions">
          <Suspense fallback={<span className="locale-switcher">{locale.toUpperCase()}</span>}>
            <LocaleSwitcher locale={locale} labels={{th: t('thai'), en: t('english'), aria: t('language')}} />
          </Suspense>
          <Link href="/booking" locale={locale} className="button button-small button-accent">{t('booking')}</Link>
        </div>
        <details className="mobile-menu">
          <summary aria-label="Menu"><MenuIcon /></summary>
          <div className="mobile-menu-panel">
            {links.map((link) => link.children ? (
              <details key={link.href} className="mobile-submenu">
                <summary>{link.label}<ChevronDownIcon /></summary>
                <div className="mobile-submenu-links">
                  <Link href={link.href} locale={locale} className="mobile-submenu-overview">{link.label}</Link>
                  {link.children.map((child) => (
                    <Link key={child.href} href={child.href} locale={locale}>
                      <ChildVisual child={child} />
                      <span>{child.label}</span>
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              <Link key={link.href} href={link.href} locale={locale}>{link.label}</Link>
            ))}
            <Link href="/booking" locale={locale} className="button button-accent">{t('booking')}</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
