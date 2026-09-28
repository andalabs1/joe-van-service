import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {BriefcaseIcon, PinIcon, UsersIcon} from '@/components/icons';

export function VehicleCard({
  image,
  title,
  seats,
  luggage,
  seat,
  price,
  href,
  locale,
  actionLabel
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
}) {
  return (
    <article className="vehicle-card">
      <div className="vehicle-card-image">
        <Image src={image} alt={title} fill sizes="(max-width: 760px) 82vw, (max-width: 1000px) 45vw, 30vw" />
      </div>
      <div className="vehicle-card-body">
        <h3>{title}</h3>
        <ul className="vehicle-card-specs">
          <li><UsersIcon />{seats}</li>
          <li><BriefcaseIcon />{luggage}</li>
          <li><PinIcon />{seat}</li>
        </ul>
        {price && <p className="vehicle-card-price">{price}</p>}
        <Link href={href} locale={locale} className="button button-dark button-wide vehicle-card-button">{actionLabel}</Link>
      </div>
    </article>
  );
}
