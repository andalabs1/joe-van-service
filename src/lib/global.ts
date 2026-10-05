// Central contact / site config — แก้เบอร์ตรงนี้ที่เดียวทั้งเว็บ
// โทรหลัก: 0999241591 / WhatsApp: 0905957563 (66905957563)

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const normalizedSiteUrl = rawSiteUrl ? rawSiteUrl.replace(/\/+$/, '') : '';

export const siteUrl = normalizedSiteUrl || 'https://www.mongkonridemate.com';

export const phone = '0999241591';
export const phoneDisplay = '099-924-1591';

export const lineId = '@385hqvbc';
export const lineUrl = 'https://line.me/R/ti/p/@385hqvbc';

// WhatsApp ใช้เบอร์ 0905957563 (international format สำหรับ wa.me)
export const whatsappNumber = '66905957563';
export const whatsappLocal = '0905957563';
export const whatsappDisplay = '090-595-7563';
export const whatsappUrl = `https://wa.me/${whatsappNumber}`;

export const contactEmail = 'MONGKON_RideMate@gmail.com';
