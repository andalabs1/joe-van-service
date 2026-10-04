'use server';

import {z} from 'zod';
import {buildBookingFlexMessage, isLineConfigured, pushLineFlex} from '@/lib/line';

export type BookingState = {
  status: 'idle' | 'error' | 'success' | 'unconfigured';
  message?: string;
  reference?: string;
  errors?: Record<string, string[]>;
};

const bookingSchema = z.object({
  locale: z.enum(['th', 'en']),
  pickupDate: z
    .string()
    .min(1)
    .refine(
      (value) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = new Date(`${value}T00:00:00`);
        return !Number.isNaN(selected.getTime()) && selected >= today;
      },
      {message: 'pickupDate must be today or a future date'}
    ),
  pickupTime: z.string().min(1),
  origin: z.string().trim().min(2).max(160),
  destination: z.string().trim().min(2).max(160),
  tripType: z.enum(['one-way', 'round-trip', 'overnight']),
  passengers: z.coerce.number().int().min(1).max(50),
  vehicleType: z.enum(['commuter8', 'commuter10', 'newCommuter8', 'newCommuter10', 'suv', 'sedan']),
  luggage: z.string().trim().max(120).optional(),
  telephone: z.string().trim().min(8).max(30),
  lineChannel: z.enum(['line', 'whatsapp']).default('line'),
  lineId: z.string().trim().min(1).max(100),
  notes: z.string().trim().max(1500).optional(),
  website: z.string().max(0)
});

export async function submitBooking(
  _previousState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const values = Object.fromEntries(formData.entries());
  const parsed = bookingSchema.safeParse(values);
  const locale = values.locale === 'en' ? 'en' : 'th';

  if (!parsed.success) {
    return {
      status: 'error',
      message: locale === 'th' ? 'กรุณาตรวจสอบข้อมูลที่จำเป็น' : 'Please check the required information.',
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const webhookUrl = process.env.BOOKING_WEBHOOK_URL;
  const lineEnabled = isLineConfigured();
  if (!webhookUrl && !lineEnabled) {
    return {
      status: 'unconfigured',
      message: locale === 'th'
        ? 'แบบฟอร์มยังไม่เชื่อมช่องทางรับเรื่อง กรุณาติดต่อทางโทรศัพท์หรือ LINE หลังเปิดใช้งานจริง'
        : 'The form is not connected to an enquiry channel yet. Please use phone or LINE after launch.'
    };
  }

  const reference = `JV-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

  try {
    // 1) ส่งเข้า LINE group (หลัก) — ไม่ block การจองถ้าส่ง LINE พลาดแต่ webhook สำเร็จ
    let lineError: unknown = null;
    if (lineEnabled) {
      try {
        await pushLineFlex(buildBookingFlexMessage({reference, ...parsed.data, locale}));
      } catch (error) {
        lineError = error;
        console.error('[booking] LINE push failed:', error);
      }
    }

    // 2) ส่งเข้า webhook เดิม (ถ้ามีตั้งค่าไว้ เช่น Google Sheet / Slack / อื่นๆ)
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({reference, ...parsed.data}),
        cache: 'no-store'
      });

      if (!response.ok) throw new Error('Booking webhook returned a non-success status');
    } else if (lineError) {
      // มีแค่ LINE แต่ส่งไม่สำเร็จ = ถือว่าส่งไม่สำเร็จ
      throw lineError;
    }

    return {
      status: 'success',
      reference,
      message: locale === 'th'
        ? `ส่งคำขอแล้ว หมายเลขอ้างอิง ${reference}`
        : `Request sent. Your reference is ${reference}`
    };
  } catch {
    return {
      status: 'error',
      message: locale === 'th'
        ? 'ส่งคำขอไม่สำเร็จ กรุณาลองอีกครั้งหรือติดต่อโดยตรง'
        : 'The request could not be sent. Please try again or contact us directly.'
    };
  }
}
