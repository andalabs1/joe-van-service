# mongkonridemate

Multilingual, SEO-first website for a private van service in Thailand.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The root path redirects to `/th`.

## Checks

```bash
npm run lint
npm run build
```

## Environment variables

Copy `.env.example` to `.env.local` and provide the confirmed production values:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_PHONE`
- `NEXT_PUBLIC_LINE_URL`
- `BOOKING_WEBHOOK_URL`

The booking form intentionally returns a configuration notice until `BOOKING_WEBHOOK_URL` is set. It never claims that an enquiry was delivered when no receiver is configured.

## Routes

- `/th` and `/en`
- `/[locale]/services-rates`
- `/[locale]/services-rates/[slug]`
- `/[locale]/routes` (all regions as `#region-*` anchor sections)
- `/[locale]/contact`
- `/[locale]/booking`

See `WEBSITE_SPEC.md` for the content, pricing and launch checklist. Reference prices must be confirmed before production launch.
