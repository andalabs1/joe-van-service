'use client';

import {useActionState, useEffect, useRef} from 'react';
import {useFormStatus} from 'react-dom';
import {toast} from 'sonner';
import {Input} from 'antd';
import {submitBooking, type BookingState} from '@/app/[locale]/booking/actions';
import type {Locale} from '@/i18n/routing';
import {BriefcaseIcon, CalendarIcon, ClockIcon, CompassIcon, LineIcon, MailIcon, PhoneIcon, PinIcon, RouteIcon, SendIcon, UsersIcon} from './icons';
import {FormSelect} from './form-select';
import {FormPendingToast} from './form-pending-toast';
import {FormDatePicker, FormNumber, FormTimePicker} from './form-fields';

type BookingLabels = {
  tripTitle: string;
  contactTitle: string;
  pickupDate: string;
  pickupTime: string;
  origin: string;
  destination: string;
  tripType: string;
  oneWay: string;
  roundTrip: string;
  overnight: string;
  passengers: string;
  vehicleType: string;
  selectVehicle: string;
  luggage: string;
  luggagePlaceholder: string;
  telephone: string;
  lineId: string;
  notes: string;
  submit: string;
  submitting: string;
};

type VehicleOption = {value: string; label: string};

const initialState: BookingState = {status: 'idle'};

const BOOKING_TOAST_ID = 'booking-form-status';

function SubmitButton({labels}: {labels: BookingLabels}) {
  const {pending} = useFormStatus();
  return <button className="button button-accent button-wide booking-submit" type="submit" disabled={pending}><SendIcon />{pending ? labels.submitting : labels.submit}</button>;
}

function FieldError({state, name}: {state: BookingState; name: string}) {
  const message = state.errors?.[name]?.[0];
  return message ? <span className="field-error">{message}</span> : null;
}

export function BookingForm({
  locale,
  labels,
  vehicles,
  defaults
}: {
  locale: Locale;
  labels: BookingLabels;
  vehicles: VehicleOption[];
  defaults: {origin?: string; destination?: string; vehicle?: string; notes?: string};
}) {
  const [state, formAction] = useActionState(submitBooking, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const lastToastRef = useRef<string | null>(null);

  useEffect(() => {
    if (!state.message) return;
    const key = `${state.status}:${state.message}`;
    if (lastToastRef.current === key) return;
    lastToastRef.current = key;

    if (state.status === 'success') {
      toast.success(state.message, {id: BOOKING_TOAST_ID});
      formRef.current?.reset();
    } else if (state.status === 'unconfigured') {
      toast.warning(state.message, {id: BOOKING_TOAST_ID});
    } else if (state.status === 'error') {
      toast.error(state.message, {id: BOOKING_TOAST_ID});
    }
  }, [state.message, state.status]);

  return (
    <form ref={formRef} action={formAction} className="booking-form">
      <FormPendingToast message={labels.submitting} toastId={BOOKING_TOAST_ID} />
      <input type="hidden" name="locale" value={locale} />
      <div className="honeypot" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <fieldset>
        <legend>{labels.tripTitle}</legend>
        <div className="form-grid">
          <label className="field">
            <span><CalendarIcon />{labels.pickupDate}<span className="required-mark" aria-hidden="true">*</span></span>
            <FormDatePicker name="pickupDate" ariaLabel={labels.pickupDate} placeholder={labels.pickupDate} className="booking-control" />
            <FieldError state={state} name="pickupDate" />
          </label>
          <label className="field">
            <span><ClockIcon />{labels.pickupTime}<span className="required-mark" aria-hidden="true">*</span></span>
            <FormTimePicker name="pickupTime" ariaLabel={labels.pickupTime} placeholder={labels.pickupTime} className="booking-control" />
            <FieldError state={state} name="pickupTime" />
          </label>
          <label className="field">
            <span><PinIcon />{labels.origin}<span className="required-mark" aria-hidden="true">*</span></span>
            <Input name="origin" defaultValue={defaults.origin || ''} maxLength={160} required aria-label={labels.origin} className="booking-control" status={state.errors?.origin ? 'error' : ''} />
            <FieldError state={state} name="origin" />
          </label>
          <label className="field">
            <span><PinIcon />{labels.destination}<span className="required-mark" aria-hidden="true">*</span></span>
            <Input name="destination" defaultValue={defaults.destination || ''} maxLength={160} required aria-label={labels.destination} className="booking-control" status={state.errors?.destination ? 'error' : ''} />
            <FieldError state={state} name="destination" />
          </label>
          <label className="field">
            <span><UsersIcon />{labels.passengers}<span className="required-mark" aria-hidden="true">*</span></span>
            <FormNumber name="passengers" defaultValue={1} min={1} max={50} ariaLabel={labels.passengers} className="booking-control" />
            <FieldError state={state} name="passengers" />
          </label>
          <label className="field">
            <span><RouteIcon />{labels.tripType}<span className="required-mark" aria-hidden="true">*</span></span>
            <FormSelect
              name="tripType"
              defaultValue="one-way"
              options={[
                {value: 'one-way', label: labels.oneWay},
                {value: 'round-trip', label: labels.roundTrip},
                {value: 'overnight', label: labels.overnight}
              ]}
              required
              ariaLabel={labels.tripType}
              className="booking-select"
            />
            <FieldError state={state} name="tripType" />
          </label>
          <label className="field">
            <span><CompassIcon />{labels.vehicleType}<span className="required-mark" aria-hidden="true">*</span></span>
            <FormSelect
              name="vehicleType"
              defaultValue={defaults.vehicle || ''}
              options={vehicles}
              placeholder={labels.selectVehicle}
              required
              ariaLabel={labels.vehicleType}
              className="booking-select"
            />
            <FieldError state={state} name="vehicleType" />
          </label>
          <label className="field">
            <span><BriefcaseIcon />{labels.luggage}</span>
            <Input name="luggage" maxLength={120} placeholder={labels.luggagePlaceholder} aria-label={labels.luggage} className="booking-control" status={state.errors?.luggage ? 'error' : ''} />
            <FieldError state={state} name="luggage" />
          </label>
        </div>
      </fieldset>

      <fieldset className="booking-contact-fields">
        <legend className="visually-hidden">{labels.contactTitle}</legend>
        <div className="form-grid">
          <label className="field">
            <span><PhoneIcon />{labels.telephone}<span className="required-mark" aria-hidden="true">*</span></span>
            <Input name="telephone" type="tel" autoComplete="tel" maxLength={30} required aria-label={labels.telephone} className="booking-control" status={state.errors?.telephone ? 'error' : ''} />
            <FieldError state={state} name="telephone" />
          </label>
          <label className="field">
            <span><LineIcon />{labels.lineId}</span>
            <Input name="lineId" maxLength={100} aria-label={labels.lineId} className="booking-control" />
            <FieldError state={state} name="lineId" />
          </label>
          <label className="field field-full">
            <span><MailIcon />{labels.notes}</span>
            <Input.TextArea name="notes" rows={5} maxLength={1500} aria-label={labels.notes} className="booking-control" defaultValue={defaults.notes ? (locale === 'th' ? `ประเภทบริการ: ${defaults.notes}` : `Service: ${defaults.notes}`) : undefined} />
            <FieldError state={state} name="notes" />
          </label>
        </div>
      </fieldset>
      <SubmitButton labels={labels} />
    </form>
  );
}
