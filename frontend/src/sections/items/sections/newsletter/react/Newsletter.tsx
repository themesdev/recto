// Newsletter (item.json): one labelled, required address field and a button, posting to action without JavaScript;
// in a band beside the heading (inline) or in a card. After a submit the page passes status (and error, value).
import type { ReactNode } from 'react';
import { FormMessage } from '../../../../parts/field/react/FormMessage';
import { Honeypot } from '../../../../parts/field/react/Honeypot';
import { SectionHead } from '../../../../parts/section-head/react/SectionHead';
import { headingId } from '../../../../parts/section-head/id';
import { describedBy, fieldIds, formBase, HONEYPOT_NAME, type FormStatus } from '../../../../parts/field/shared';
import { spacingAttr, toneAttr } from '../../../../parts/kinds';
import { cn } from '../../../../recipes/cn';
import { newsletterClasses } from '../shared';
import { NEWSLETTER_DEFAULTS, type NewsletterContent } from '../types';

export interface NewsletterProps extends NewsletterContent {
  status?: FormStatus | null;
  error?: string | null;
  value?: string | null;
  /** The honeypot's name (default company_website); false leaves it out. */
  honeypot?: string | false | null;
  /** Replaces the text of the success or error message. */
  message?: ReactNode;
  id?: string;
  className?: string;
}

export function Newsletter({ eyebrow, heading, lead, action, emailName, emailLabel, buttonLabel, note, privacy, hiddenFields, successMessage, errorMessage, variant, tone, spacing, rules, status, error, value, message, honeypot, id, className }: NewsletterProps) {
  const d = NEWSLETTER_DEFAULTS;
  const v = variant ?? d.variant;
  const c = newsletterClasses(v, !!error);
  const hid = headingId(heading, id);
  const base = formBase(heading, id);
  const ids = fieldIds(base, 'email');
  const noteId = `${base}-note`;
  const trap = honeypot === false ? null : honeypot || HONEYPOT_NAME;
  return (
    <section id={id} data-section="newsletter" data-variant={v} data-tone={toneAttr(tone)} data-spacing={spacingAttr(spacing)} data-rules={rules ? '' : undefined} aria-labelledby={hid} className={cn(c.root, className)}>
      <div className={c.inner}>
        <div className={c.box} data-tone={v === 'band' ? 'accent' : undefined}>
          <SectionHead eyebrow={eyebrow} heading={heading} lead={lead} headingId={hid} align={v === 'card' ? 'center' : 'start'} className={c.head} />
          <form action={action} method="post" className={c.form}>
            {status ? (
              <FormMessage status={status}>{message ?? (status === 'success' ? (successMessage ?? d.successMessage) : (errorMessage ?? d.errorMessage))}</FormMessage>
            ) : null}
            {(hiddenFields ?? []).map((h, i) => (
              <input key={i} type="hidden" name={h.name} value={h.value} />
            ))}
            {trap ? <Honeypot base={base} name={trap} /> : null}
            <label htmlFor={ids.control} className={c.label}>
              {emailLabel ?? d.emailLabel}
            </label>
            <div className={c.row}>
              <input
                id={ids.control}
                name={emailName ?? d.emailName}
                type="email"
                required
                autoComplete="email"
                defaultValue={value || undefined}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={describedBy(error && ids.error, (note || privacy) && noteId)}
                className={c.input}
              />
              <button type="submit" className={c.button}>
                {buttonLabel ?? d.buttonLabel}
              </button>
            </div>
            {error ? <p id={ids.error} className={c.error}>{error}</p> : null}
            {note || privacy ? (
              <p id={noteId} className={c.note}>
                {note}
                {note && privacy ? ' ' : null}
                {privacy ? <a href={privacy.href} className={c.privacy}>{privacy.label}</a> : null}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
