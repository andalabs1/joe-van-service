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

export type LineFlexMessage = {
  type: 'flex';
  altText: string;
  contents: Record<string, unknown>;
};

export type LineMessage = LineTextMessage | LineFlexMessage;

async function pushMessages(messages: LineMessage[]): Promise<void> {
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

export async function pushLineFlex(message: LineFlexMessage): Promise<void> {
  // altText max 400 chars, bubble JSON max ~50KB — trim defensively
  const safeAlt = message.altText.length > 390 ? `${message.altText.slice(0, 390)}…` : message.altText;
  await pushMessages([{...message, altText: safeAlt}]);
}

// ---------- Flex builders ----------

type FlexText = {
  type: 'text';
  text: string;
  color?: string;
  size?: string;
  weight?: string;
  flex?: number;
  wrap?: boolean;
  align?: string;
};

function flexRow(label: string, value: string | undefined | null): Record<string, unknown> | null {
  if (!value) return null;
  return {
    type: 'box',
    layout: 'baseline',
    spacing: 'sm',
    contents: [
      {type: 'text', text: label, color: '#aaaaaa', size: 'sm', flex: 2} as FlexText,
      {type: 'text', text: truncate(value, 500), wrap: true, color: '#666666', size: 'sm', flex: 5} as FlexText
    ]
  };
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

function channelLabel(value: string | undefined | null): string {
  return value === 'whatsapp' ? 'WhatsApp' : 'LINE';
}

const TRIP_LABEL: Record<string, string> = {
  'one-way': 'เที่ยวเดียว',
  'round-trip': 'ไป-กลับ',
  overnight: 'ค้างคืน'
};

const VEHICLE_LABEL: Record<string, string> = {
  commuter8: 'Commuter 8 ที่นั่ง',
  commuter10: 'Commuter 10 ที่นั่ง',
  newCommuter8: 'New Commuter 8 ที่นั่ง',
  newCommuter10: 'New Commuter 10 ที่นั่ง',
  suv: 'SUV',
  sedan: 'Sedan'
};

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
  lineChannel: 'line' | 'whatsapp';
  lineId: string;
  notes?: string;
};

export function formatBookingLineMessage(data: BookingLinePayload): string {
  const channel = channelLabel(data.lineChannel);
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
    `💬 ${channel}: ${data.lineId}`,
    data.notes ? `📝 หมายเหตุ: ${data.notes}` : null
  ].filter(Boolean);
  return lines.join('\n');
}

export type ContactLinePayload = {
  locale: 'th' | 'en';
  name: string;
  telephone: string;
  lineChannel: 'line' | 'whatsapp';
  lineId: string;
  message: string;
};

export function formatContactLineMessage(data: ContactLinePayload): string {
  const channel = channelLabel(data.lineChannel);
  const lines = [
    '✉️ ข้อความติดต่อใหม่',
    `🌐 ภาษา: ${data.locale === 'th' ? 'ไทย' : 'English'}`,
    `👤 ชื่อ: ${data.name}`,
    `📞 โทร: ${data.telephone}`,
    `💬 ${channel}: ${data.lineId}`,
    `📝 ข้อความ: ${data.message}`
  ].filter(Boolean);
  return (lines as string[]).join('\n');
}

export function buildBookingFlexMessage(data: BookingLinePayload): LineFlexMessage {
  const BOOKING_GREEN = '#1DB446';
  const tripLabel = TRIP_LABEL[data.tripType] ?? data.tripType;
  const vehicleLabel = VEHICLE_LABEL[data.vehicleType] ?? data.vehicleType;
  const channel = channelLabel(data.lineChannel);
  const telUri = `tel:${data.telephone.replaceAll(/[^+\d]/g, '')}`;

  return {
    type: 'flex',
    altText: `แจ้งเตือน: คำขอจองใหม่ ${data.reference} - ${data.origin} → ${data.destination}`,
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: BOOKING_GREEN,
        contents: [
          {
            type: 'text',
            text: 'NEW BOOKING REQUEST',
            color: '#FFFFFF',
            weight: 'bold',
            size: 'sm',
            align: 'center'
          }
        ]
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        contents: [
          {
            type: 'text',
            text: truncate(data.reference, 60),
            weight: 'bold',
            size: 'xl'
          },
          {
            type: 'text',
            text: `${data.pickupDate} ${data.pickupTime} • ${data.locale === 'th' ? 'ภาษาไทย' : 'English'}`,
            color: '#888888',
            size: 'sm',
            margin: 'xs'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'md',
            spacing: 'sm',
            contents: [
              flexRow('ต้นทาง', data.origin),
              flexRow('ปลายทาง', data.destination),
              flexRow('ประเภท', tripLabel),
              flexRow('ผู้โดยสาร', `${data.passengers} คน`),
              flexRow('รถ', vehicleLabel),
              flexRow('สัมภาระ', data.luggage),
              flexRow('โทร', data.telephone),
              flexRow(channel, data.lineId),
              flexRow('หมายเหตุ', data.notes)
            ].filter(Boolean)
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: BOOKING_GREEN,
            action: {type: 'uri', label: `โทร ${data.telephone}`, uri: telUri}
          },
          {
            type: 'button',
            style: 'secondary',
            action: {type: 'clipboard', label: `คัดลอก ${channel}`, clipboardText: data.lineId}
          }
        ]
      }
    }
  };
}

export function buildContactFlexMessage(data: ContactLinePayload): LineFlexMessage {
  const CONTACT_GREEN = '#1DB446';
  const channel = channelLabel(data.lineChannel);
  const telUri = `tel:${data.telephone.replaceAll(/[^+\d]/g, '')}`;

  return {
    type: 'flex',
    altText: `แจ้งเตือน: ข้อความติดต่อใหม่ - ${data.name}`,
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: CONTACT_GREEN,
        contents: [
          {
            type: 'text',
            text: 'NEW CONTACT MESSAGE',
            color: '#FFFFFF',
            weight: 'bold',
            size: 'sm',
            align: 'center'
          }
        ]
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        contents: [
          {
            type: 'text',
            text: truncate(data.name, 80),
            weight: 'bold',
            size: 'xl'
          },
          {
            type: 'text',
            text: data.locale === 'th' ? 'ภาษาไทย' : 'English',
            color: '#888888',
            size: 'sm',
            margin: 'xs'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'md',
            spacing: 'sm',
            contents: [
              flexRow('โทร', data.telephone),
              flexRow(channel, data.lineId),
              flexRow('ข้อความ', data.message)
            ].filter(Boolean)
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: CONTACT_GREEN,
            action: {type: 'uri', label: `โทร ${data.telephone}`, uri: telUri}
          },
          {
            type: 'button',
            style: 'secondary',
            action: {type: 'clipboard', label: `คัดลอก ${channel}`, clipboardText: data.lineId}
          }
        ]
      }
    }
  };
}
