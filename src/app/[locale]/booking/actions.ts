'use server';

import {z} from 'zod';

export type BookingState = {
  status: 'idle' | 'error' | 'success' | 'unconfigured';
  message?: string;
  reference?: string;
  errors?: Record<string, string[]>;
};

const bookingSchema = z.object({
  locale: z.enum(['th', 'en']),
  service: z.string().min(1),
  pickupDate: z.string().min(1),
  pickupTime: z.string().min(1),
  returnDate: z.string().optional(),
  origin: z.string().trim().min(2).max(160),
  destination: z.string().trim().min(2).max(160),
  tripType: z.enum(['one-way', 'round-trip', 'overnight']),
  passengers: z.coerce.number().int().min(1).max(50),
  luggage: z.coerce.number().int().min(0).max(100),
  vans: z.coerce.number().int().min(1).max(10),
  customerName: z.string().trim().min(2).max(120),
  telephone: z.string().trim().min(8).max(30),
  lineId: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(1500).optional(),
  privacyConsent: z.literal('on'),
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
  if (!webhookUrl) {
    return {
      status: 'unconfigured',
      message: locale === 'th'
        ? 'แบบฟอร์มยังไม่เชื่อมช่องทางรับเรื่อง กรุณาติดต่อทางโทรศัพท์หรือ LINE หลังเปิดใช้งานจริง'
        : 'The form is not connected to an enquiry channel yet. Please use phone or LINE after launch.'
    };
  }

  const reference = `JV-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({reference, ...parsed.data}),
      cache: 'no-store'
    });

    if (!response.ok) throw new Error('Booking webhook returned a non-success status');

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
