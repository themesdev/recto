// Form controls shared by the form sections (newsletter, form): a labelled field with its hint and error, and the
// message a form shows after a submit. Framework-free: Field.astro and react/Field.tsx draw the same DOM from these.
// Forms post without JavaScript: the handler at `action` answers with the page again (status, errors, values) or with a
// redirect, so every state here is server-rendered.
import { cn } from '../../recipes/cn';

/** The outcome of the last submit, as the page that answers it renders it. */
export type FormStatus = 'success' | 'error';
export type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'select';

/** A name/value pair sent with the form unseen (a provider's list id). */
export interface HiddenField {
  name: string;
  value: string;
}

/** The honeypot's default name: a field people never see or fill, so a filled one means a bot. Not a name browsers
 *  autofill (url, website, organization), so a real visitor's autofill leaves it empty. */
export const HONEYPOT_NAME = 'company_website';

/** The honeypot: out of sight (sr-only) and out of the accessibility tree (aria-hidden), skipped by Tab (tabindex
 *  -1) and by autofill and password managers. No JavaScript: the handler rejects a submit in which it is filled. */
export const honeypotClasses = { root: 'sr-only' };
export const HONEYPOT_LABEL = 'Leave this field empty';

/** The base of a form's ids: the section's id, else its heading as a slug. Stable on the server and in the browser. */
export const formBase = (heading: string, id?: string | null) =>
  id ?? (heading.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'form');

/** The ids of a field: the control, its hint and its error (aria-describedby points at the last two). */
export const fieldIds = (base: string, name: string) => ({ control: `${base}-${name}`, hint: `${base}-${name}-hint`, error: `${base}-${name}-error` });

/** aria-describedby from the ids that are there; undefined when none. */
export const describedBy = (...ids: (string | false | null | undefined)[]) => ids.filter(Boolean).join(' ') || undefined;

export const fieldClasses = (type: FieldType, invalid: boolean) => ({
  root: 'flex flex-col gap-2',
  label: 'font-medium text-foreground',
  optional: 'font-normal text-muted-foreground',
  control: cn(
    'block min-h-11 w-full rounded-button border bg-background px-3 py-2 text-foreground transition-colors on-disabled:cursor-not-allowed on-disabled:opacity-(--state-disabled-opacity)',
    invalid ? 'border-2 border-destructive' : 'border-input on-hover:border-foreground on-press:border-primary',
    type === 'textarea' && 'min-h-32 resize-y',
  ),
  hint: 'text-muted-foreground',
  error: 'font-medium text-destructive',
});

/** The message after a submit: a quiet confirmation, or an error in the error colour. */
export const messageClasses = (status: FormStatus) =>
  cn('rounded-md p-4 font-medium', status === 'success' ? 'bg-primary-soft text-primary-soft-foreground' : 'border-2 border-destructive text-destructive');

/** The message's role: a status (polite) after success, an alert after an error. */
export const messageRole = (status: FormStatus) => (status === 'success' ? 'status' : 'alert');
