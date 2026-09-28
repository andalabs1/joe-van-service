'use client';

import {useActionState} from 'react';
import {useFormStatus} from 'react-dom';
import {Checkbox, Input} from 'antd';
import {submitContact, type ContactState} from '@/app/[locale]/contact/actions';
import type {Locale} from '@/i18n/routing';

type ContactLabels = {
  name: string;
  telephone: string;
  lineId: string;
  message: string;
  consent: string;
  submit: string;
  submitting: string;
};

const initialState: ContactState = {status: 'idle'};

function FieldError({state, name}: {state: ContactState; name: string}) {
  const message = state.errors?.[name]?.[0];
  return message ? <span className="field-error">{message}</span> : null;
}

function SubmitButton({labels}: {labels: ContactLabels}) {
  const {pending} = useFormStatus();
  return <button className="button button-accent button-wide" type="submit" disabled={pending}>{pending ? labels.submitting : labels.submit}</button>;
}

export function ContactForm({locale, labels}: {locale: Locale; labels: ContactLabels}) {
  const [state, formAction] = useActionState(submitContact, initialState);

  return (
    <form action={formAction} className="contact-enquiry-form">
      <input type="hidden" name="locale" value={locale} />
      <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>

      {state.message && <div className={`form-status form-status-${state.status}`} role="status">{state.message}</div>}

      <div className="form-grid">
        <label className="field">
          <span>{labels.name}</span>
          <Input name="name" autoComplete="name" maxLength={120} required aria-label={labels.name} className="booking-control" status={state.errors?.name ? 'error' : ''} />
          <FieldError state={state} name="name" />
        </label>
        <label className="field">
          <span>{labels.telephone}</span>
          <Input name="telephone" type="tel" autoComplete="tel" maxLength={30} required aria-label={labels.telephone} className="booking-control" status={state.errors?.telephone ? 'error' : ''} />
          <FieldError state={state} name="telephone" />
        </label>
        <label className="field field-full">
          <span>{labels.lineId}</span>
          <Input name="lineId" maxLength={100} aria-label={labels.lineId} className="booking-control" />
        </label>
        <label className="field field-full">
          <span>{labels.message}</span>
          <Input.TextArea name="message" rows={5} maxLength={1500} required aria-label={labels.message} className="booking-control" status={state.errors?.message ? 'error' : ''} />
          <FieldError state={state} name="message" />
        </label>
        <div className="checkbox-field field-full">
          <Checkbox name="privacyConsent" value="on" required>{labels.consent}</Checkbox>
          <FieldError state={state} name="privacyConsent" />
        </div>
      </div>
      <SubmitButton labels={labels} />
    </form>
  );
}
