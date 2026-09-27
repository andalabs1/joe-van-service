import {Link} from '@/i18n/navigation';

export default function NotFound() {
  return <section className="not-found shell"><p className="eyebrow">404</p><h1>Page not found</h1><p>ไม่พบหน้าที่ต้องการ / The requested page could not be found.</p><Link href="/" className="button button-dark">กลับหน้าแรก / Back home</Link></section>;
}
