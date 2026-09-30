import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {BriefcaseIcon, CarIcon, UsersIcon} from '@/components/icons';

export function VehicleCard({
  image,
  title,
  seats,
  luggage,
  seat,
  price,
  href,
  locale,
  actionLabel,
  badge
}: {
  image: string;
  title: string;
  seats: string;
  luggage: string;
  seat: string;
  price?: string;
  href: string;
  locale: Locale;
  actionLabel: string;
  badge?: string;
}) {
  return (
    <article className="vehicle-card">
      {badge && (
        <p className="vehicle-card-badge">
          <span aria-hidden="true" className="vehicle-card-badge-icon">%</span>
          {badge}
        </p>
      )}
      <div className="vehicle-card-image">
        <Image src={image} alt={title} fill sizes="(max-width: 760px) 82vw, (max-width: 1000px) 45vw, 30vw" />
      </div>
      <div className="vehicle-card-body">
        <h3>{title}</h3>
        <ul className="vehicle-card-specs">
          <li><UsersIcon />{seats}</li>
          <li><BriefcaseIcon />{luggage}</li>
          <li><CarIcon />{seat}</li>
        </ul>
        <Link href={href} locale={locale} className="vehicle-card-button">
          {price ? `${actionLabel} (${price})` : actionLabel}
        </Link>
      </div>
    </article>
  );
}
