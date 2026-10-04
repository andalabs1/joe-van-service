'use server';

import {z} from 'zod';
import {buildContactFlexMessage, isLineConfigured, pushLineFlex} from '@/lib/line';

export type ContactState = {
  status: 'idle' | 'error' | 'success' | 'unconfigured';
  message?: string;
  errors?: Record<string, string[]>;
};

const contactSchema = z.object({
  locale: z.enum(['th', 'en']),
  name: z.string().trim().min(2).max(120),
  telephone: z.string().trim().min(8).max(30),
  lineChannel: z.enum(['line', 'whatsapp']).default('line'),
  lineId: z.string().trim().min(1).max(100),
  message: z.string().trim().min(5).max(1500),
  privacyConsent: z.literal('on'),
  website: z.string().max(0)
});

export async function submitContact(
  _previousState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const values = Object.fromEntries(formData.entries());
  const parsed = contactSchema.safeParse(values);
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
        ? 'แบบฟอร์มยังไม่เชื่อมช่องทางรับเรื่อง กรุณาติดต่อทางโทรศัพท์หรือ LINE'
        : 'The form is not connected yet. Please contact us by phone or LINE.'
    };
  }

  try {
    let lineError: unknown = null;
    if (lineEnabled) {
      try {
        await pushLineFlex(buildContactFlexMessage({...parsed.data, locale}));
      } catch (error) {
        lineError = error;
        console.error('[contact] LINE push failed:', error);
      }
    }

    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({type: 'contact', ...parsed.data}),
        cache: 'no-store'
      });

      if (!response.ok) throw new Error('Contact webhook returned a non-success status');
    } else if (lineError) {
      throw lineError;
    }

    return {
      status: 'success',
      message: locale === 'th' ? 'ส่งข้อความเรียบร้อยแล้ว ทีมงานจะติดต่อกลับโดยเร็ว' : 'Message sent. Our team will contact you shortly.'
    };
  } catch {
    return {
      status: 'error',
      message: locale === 'th' ? 'ส่งข้อความไม่สำเร็จ กรุณาลองอีกครั้งหรือติดต่อโดยตรง' : 'The message could not be sent. Please try again or contact us directly.'
    };
  }
}
