import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {vehicleModels} from '@/data/vehicles';
import {LocaleSwitcher} from './locale-switcher';
import {Logo} from './logo';
import {DesktopNav, type DesktopNavLink} from './desktop-nav';
import {MobileDrawer, type DrawerLink} from './mobile-drawer';
import {Suspense} from 'react';

export async function SiteHeader({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: 'Common'});
  const vehicle = await getTranslations({locale, namespace: 'Vehicle'});
  const bangkok = await getTranslations({locale, namespace: 'Bangkok'});
  const regionLinks = [
    {value: 'metropolitan', label: bangkok('metropolitan')},
    {value: 'east', label: bangkok('east')},
    {value: 'west', label: bangkok('west')},
    {value: 'north-northeast', label: bangkok('northNortheast')},
    {value: 'south', label: bangkok('south')}
  ].map((region) => ({
    href: `/routes#region-${region.value}`,
    label: region.label,
    iconName: region.value
  }));
  const links: DesktopNavLink[] = [
    {href: '/', label: t('home')},
    {href: '/services-rates', label: t('services')},
    {
      href: '/vehicles',
      label: t('vehicles'),
      children: vehicleModels.map((model) => ({
        href: `/vehicles#vehicle-group-${model.group}`,
        label: vehicle(model.category),
        image: model.image
      }))
    },
    {href: '/routes', label: t('routes'), children: regionLinks},
    {href: '/contact', label: t('contact')}
  ];
  const drawerLinks: DrawerLink[] = [
    {href: '/', label: t('home')},
    {href: '/services-rates', label: t('services')},
    {
      href: '/vehicles',
      label: t('vehicles'),
      children: vehicleModels.map((model) => ({
        href: `/vehicles#vehicle-group-${model.group}`,
        label: vehicle(model.category),
        image: model.image
      }))
    },
    {
      href: '/routes',
      label: t('routes'),
      children: [
        {href: '/routes#region-metropolitan', label: bangkok('metropolitan'), iconName: 'metropolitan'},
        {href: '/routes#region-east', label: bangkok('east'), iconName: 'east'},
        {href: '/routes#region-west', label: bangkok('west'), iconName: 'west'},
        {href: '/routes#region-north-northeast', label: bangkok('northNortheast'), iconName: 'north-northeast'},
        {href: '/routes#region-south', label: bangkok('south'), iconName: 'south'}
      ]
    },
    {href: '/contact', label: t('contact')}
  ];

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo locale={locale} label={t('home')} />
        <DesktopNav locale={locale} links={links} />
        <div className="header-actions">
          <Suspense fallback={<span className="locale-switcher">{locale.toUpperCase()}</span>}>
            <LocaleSwitcher locale={locale} labels={{th: t('thai'), en: t('english'), aria: t('language')}} />
          </Suspense>
          <Link href="/booking" locale={locale} className="button button-small button-accent">{t('booking')}</Link>
        </div>
        <MobileDrawer
          locale={locale}
          links={drawerLinks}
          bookingLabel={t('booking')}
          languageLabels={{th: t('thai'), en: t('english'), aria: t('language')}}
          menuLabel={locale === 'th' ? 'เมนู' : 'Menu'}
          closeLabel={locale === 'th' ? 'ปิดเมนู' : 'Close menu'}
        />
      </div>
    </header>
  );
}
