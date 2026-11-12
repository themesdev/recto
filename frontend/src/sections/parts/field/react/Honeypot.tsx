// The honeypot of a form (shared.ts › HONEYPOT_NAME): a text field nobody sees, reaches with Tab or hears, and
// autofill skips. Bots that fill every field fill it too; the handler rejects a submit in which it isn't empty.
import { fieldIds, HONEYPOT_LABEL, honeypotClasses } from '../shared';

export interface HoneypotProps {
  /** The form's id base (formBase). */
  base: string;
  /** The name it posts. */
  name: string;
}

export function Honeypot({ base, name }: HoneypotProps) {
  const id = fieldIds(base, name).control;
  return (
    <div aria-hidden="true" className={honeypotClasses.root}>
      <label htmlFor={id}>{HONEYPOT_LABEL}</label>
      <input id={id} name={name} type="text" tabIndex={-1} autoComplete="off" data-1p-ignore="" data-lpignore="true" data-bwignore="" />
    </div>
  );
}
