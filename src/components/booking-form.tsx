'use client';

import {useActionState} from 'react';
import {useFormStatus} from 'react-dom';
import {Checkbox, Input} from 'antd';
import {submitBooking, type BookingState} from '@/app/[locale]/booking/actions';
import type {Locale} from '@/i18n/routing';
import {FormSelect} from './form-select';
import {FormDatePicker, FormNumber, FormTimePicker} from './form-fields';

type BookingLabels = {
  tripTitle: string;
  contactTitle: string;
  service: string;
  selectService: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  origin: string;
  destination: string;
  tripType: string;
  oneWay: string;
  roundTrip: string;
  overnight: string;
  passengers: string;
  luggage: string;
  vans: string;
  name: string;
  telephone: string;
  lineId: string;
  notes: string;
  consent: string;
  submit: string;
  submitting: string;
};

type ServiceOption = {value: string; label: string};

const initialState: BookingState = {status: 'idle'};

function SubmitButton({labels}: {labels: BookingLabels}) {
  const {pending} = useFormStatus();
  return <button className="button button-accent button-wide" type="submit" disabled={pending}>{pending ? labels.submitting : labels.submit}</button>;
}

function FieldError({state, name}: {state: BookingState; name: string}) {
  const message = state.errors?.[name]?.[0];
  return message ? <span className="field-error">{message}</span> : null;
}

export function BookingForm({
  locale,
  labels,
  services,
  defaults
}: {
  locale: Locale;
  labels: BookingLabels;
  services: ServiceOption[];
  defaults: {service?: string; origin?: string; destination?: string; notes?: string};
}) {
  const [state, formAction] = useActionState(submitBooking, initialState);

  return (
    <form action={formAction} className="booking-form">
      <input type="hidden" name="locale" value={locale} />
      <div className="honeypot" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {state.message && (
        <div className={`form-status form-status-${state.status}`} role="status">
          {state.message}
        </div>
      )}

      <fieldset>
        <legend>{labels.tripTitle}</legend>
        <div className="form-grid">
          <label className="field field-full">
            <span>{labels.service}</span>
            <FormSelect
              name="service"
              defaultValue={defaults.service || ''}
              options={services}
              placeholder={labels.selectService}
              required
              ariaLabel={labels.service}
              className="booking-select"
            />
            <FieldError state={state} name="service" />
          </label>
          <label className="field">
            <span>{labels.pickupDate}</span>
            <FormDatePicker name="pickupDate" ariaLabel={labels.pickupDate} placeholder={labels.pickupDate} className="booking-control" />
            <FieldError state={state} name="pickupDate" />
          </label>
          <label className="field">
            <span>{labels.pickupTime}</span>
            <FormTimePicker name="pickupTime" ariaLabel={labels.pickupTime} placeholder={labels.pickupTime} className="booking-control" />
            <FieldError state={state} name="pickupTime" />
          </label>
          <label className="field">
            <span>{labels.returnDate}</span>
            <FormDatePicker name="returnDate" ariaLabel={labels.returnDate} placeholder={labels.returnDate} className="booking-control" />
            <FieldError state={state} name="returnDate" />
          </label>
          <label className="field">
            <span>{labels.tripType}</span>
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
          </label>
          <label className="field field-full">
            <span>{labels.origin}</span>
            <Input name="origin" defaultValue={defaults.origin || ''} maxLength={160} required aria-label={labels.origin} className="booking-control" status={state.errors?.origin ? 'error' : ''} />
            <FieldError state={state} name="origin" />
          </label>
          <label className="field field-full">
            <span>{labels.destination}</span>
            <Input name="destination" defaultValue={defaults.destination || ''} maxLength={160} required aria-label={labels.destination} className="booking-control" status={state.errors?.destination ? 'error' : ''} />
            <FieldError state={state} name="destination" />
          </label>
          <label className="field">
            <span>{labels.passengers}</span>
            <FormNumber name="passengers" defaultValue={1} min={1} max={50} ariaLabel={labels.passengers} className="booking-control" />
            <FieldError state={state} name="passengers" />
          </label>
          <label className="field">
            <span>{labels.luggage}</span>
            <FormNumber name="luggage" defaultValue={0} min={0} max={100} ariaLabel={labels.luggage} className="booking-control" />
            <FieldError state={state} name="luggage" />
          </label>
          <label className="field">
            <span>{labels.vans}</span>
            <FormNumber name="vans" defaultValue={1} min={1} max={10} ariaLabel={labels.vans} className="booking-control" />
            <FieldError state={state} name="vans" />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>{labels.contactTitle}</legend>
        <div className="form-grid">
          <label className="field">
            <span>{labels.name}</span>
            <Input name="customerName" autoComplete="name" maxLength={120} required aria-label={labels.name} className="booking-control" status={state.errors?.customerName ? 'error' : ''} />
            <FieldError state={state} name="customerName" />
          </label>
          <label className="field">
            <span>{labels.telephone}</span>
            <Input name="telephone" type="tel" autoComplete="tel" maxLength={30} required aria-label={labels.telephone} className="booking-control" status={state.errors?.telephone ? 'error' : ''} />
            <FieldError state={state} name="telephone" />
          </label>
          <label className="field field-full">
            <span>{labels.lineId}</span>
            <Input name="lineId" maxLength={100} aria-label={labels.lineId} className="booking-control" />
            <FieldError state={state} name="lineId" />
          </label>
          <label className="field field-full">
            <span>{labels.notes}</span>
            <Input.TextArea name="notes" rows={5} maxLength={1500} aria-label={labels.notes} className="booking-control" defaultValue={defaults.notes ? (locale === 'th' ? `รุ่นรถที่สนใจ: ${defaults.notes}` : `Preferred vehicle: ${defaults.notes}`) : undefined} />
            <FieldError state={state} name="notes" />
          </label>
          <div className="checkbox-field field-full">
            <Checkbox name="privacyConsent" value="on" required>
              {labels.consent}
            </Checkbox>
            <FieldError state={state} name="privacyConsent" />
          </div>
        </div>
      </fieldset>
      <SubmitButton labels={labels} />
    </form>
  );
}
