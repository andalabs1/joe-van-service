'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import type {Locale} from '@/i18n/routing';
import {lineUrl, phone, whatsappUrl} from '@/lib/site';
import {CloseIcon, LineIcon, PhoneIcon, WhatsappIcon} from './icons';

function formatPhoneDisplay(value: string): string {
  const digits = value.replaceAll(/\D/g, '');
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return value;
}

export function FloatingContact({locale}: {locale: Locale}) {
  void locale;
  const t = useTranslations('Common');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const items = [
    {
      key: 'phone',
      href: `tel:${phone.replaceAll(/\s/g, '').replaceAll('-', '')}`,
      icon: PhoneIcon,
      label: t('call'),
      sub: formatPhoneDisplay(phone),
      className: 'floating-contact-item is-phone'
    },
    {
      key: 'line',
      href: lineUrl,
      icon: LineIcon,
      label: t('line'),
      sub: '@385hqvbc',
      className: 'floating-contact-item is-line',
      external: true
    },
    {
      key: 'whatsapp',
      href: whatsappUrl,
      icon: WhatsappIcon,
      label: 'WhatsApp',
      sub: formatPhoneDisplay(phone),
      className: 'floating-contact-item is-whatsapp',
      external: true
    }
  ];

  return (
    <div ref={wrapRef} className={`floating-contact-wrap${open ? ' is-open' : ''}`}>
      <ul className="floating-contact-menu" aria-hidden={!open} inert={!open}>
        {items.map(({key, href, icon: Icon, label, sub, className, external}) => (
          <li key={key}>
            <a
              href={href}
              className={className}
              tabIndex={open ? 0 : -1}
              {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
            >
              <span className="floating-contact-item-icon"><Icon /></span>
              <span className="floating-contact-item-text">
                <strong>{label}</strong>
                <small>{sub}</small>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="floating-contact"
        aria-label={t('contact')}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="floating-contact-icon">{open ? <CloseIcon /> : <PhoneIcon />}</span>
        <span>{t('contact')}</span>
      </button>
    </div>
  );
}
