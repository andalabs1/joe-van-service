// LINE Messaging API — helper สำหรับส่งข้อความจาก booking/contact form
// Docs: https://developers.line.biz/en/reference/messaging-api/#send-push-message
//
// รองรับ env ทั้งชื่อใหม่และชื่อเดิมใน .env ของโปรเจกต์นี้:
//   LINE_CHANNEL_ACCESS_TOKEN | ACCESS_KEY_ID        (Channel access token, long-lived)
//   LINE_GROUP_ID | LINE_TO_ID | GROUP_ID            (ปลายทาง push: groupId / userId)
//   LINE_CHANNEL_SECRET | CHANEL_SECET_KEY           (ยังไม่ใช้ตอน push, เก็บไว้ verify webhook ภายหลัง)

const LINE_PUSH_URL = 'https://api.line.me/v2/bot/message/push';

function readEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function getLineConfig() {
  const channelAccessToken = readEnv('LINE_CHANNEL_ACCESS_TOKEN', 'ACCESS_KEY_ID');
  const to = readEnv('LINE_GROUP_ID', 'LINE_TO_ID', 'GROUP_ID');
  const channelSecret = readEnv('LINE_CHANNEL_SECRET', 'CHANEL_SECET_KEY', 'CHANNEL_SECRET');
  return {channelAccessToken, to, channelSecret};
}

export function isLineConfigured(): boolean {
  const {channelAccessToken, to} = getLineConfig();
  return Boolean(channelAccessToken && to);
}

export type LineTextMessage = {
  type: 'text';
  text: string;
};

async function pushMessages(messages: LineTextMessage[]): Promise<void> {
  const {channelAccessToken, to} = getLineConfig();
  if (!channelAccessToken || !to) {
    throw new Error('LINE is not configured (missing access token or destination)');
  }

  const response = await fetch(LINE_PUSH_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${channelAccessToken}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({to, messages}),
    cache: 'no-store'
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`LINE push failed (${response.status}): ${detail.slice(0, 500)}`);
  }
}

export async function pushLineText(text: string): Promise<void> {
  // LINE text limit = 5000 chars
  const safe = text.length > 4900 ? `${text.slice(0, 4900)}\n…(ตัดข้อความส่วนเกิน)` : text;
  await pushMessages([{type: 'text', text: safe}]);
}

export type BookingLinePayload = {
  reference: string;
  locale: 'th' | 'en';
  pickupDate: string;
  pickupTime: string;
  origin: string;
  destination: string;
  tripType: string;
  passengers: number;
  vehicleType: string;
  luggage?: string;
  telephone: string;
  lineId?: string;
  notes?: string;
};

export function formatBookingLineMessage(data: BookingLinePayload): string {
  const lines = [
    '🚐 คำขอจองใหม่ ' + data.reference,
    `🌐 ภาษา: ${data.locale === 'th' ? 'ไทย' : 'English'}`,
    `📅 รับ: ${data.pickupDate} ${data.pickupTime}`,
    `📍 ต้นทาง: ${data.origin}`,
    `🏁 ปลายทาง: ${data.destination}`,
    `🔁 ประเภท: ${data.tripType}`,
    `👥 ผู้โดยสาร: ${data.passengers} | 🚐 ประเภทรถ: ${data.vehicleType}`,
    data.luggage ? `🧳 สัมภาระ: ${data.luggage}` : null,
    `📞 โทร: ${data.telephone}`,
    data.lineId ? `💬 LINE: ${data.lineId}` : null,
    data.notes ? `📝 หมายเหตุ: ${data.notes}` : null
  ].filter(Boolean);
  return lines.join('\n');
}

export type ContactLinePayload = {
  locale: 'th' | 'en';
  name: string;
  telephone: string;
  lineId?: string;
  message: string;
};

export function formatContactLineMessage(data: ContactLinePayload): string {
  const lines = [
    '✉️ ข้อความติดต่อใหม่',
    `🌐 ภาษา: ${data.locale === 'th' ? 'ไทย' : 'English'}`,
    `👤 ชื่อ: ${data.name}`,
    `📞 โทร: ${data.telephone}`,
    data.lineId ? `💬 LINE: ${data.lineId}` : null,
    `📝 ข้อความ: ${data.message}`
  ].filter(Boolean);
  return (lines as string[]).join('\n');
}
