// One form field: a visible label, an optional hint (between label and control: read before typing), the control
// (input, select or text area) and, after a failed submit, its error. The control points at the hint and the error
// with aria-describedby and is aria-invalid while it has an error.
import { cn } from '../../../recipes/cn';
import { describedBy, fieldClasses, fieldIds, type FieldType } from '../shared';

export interface FieldProps {
  /** The form's id base (formBase). */
  base: string;
  /** The name the form posts. */
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  /** Shown after the label of a field that isn't required. */
  optionalText?: string;
  autocomplete?: string;
  value?: string | null;
  hint?: string | null;
  error?: string | null;
  /** select: the choices, and the empty first one. */
  options?: string[] | null;
  placeholderOption?: string;
  className?: string;
}

export function Field({ base, name, label, type = 'text', required = false, optionalText = 'optional', autocomplete, value, hint, error, options, placeholderOption = 'Choose one', className }: FieldProps) {
  const ids = fieldIds(base, name);
  const c = fieldClasses(type, !!error);
  const common = {
    id: ids.control,
    name,
    required,
    autoComplete: autocomplete,
    'aria-invalid': error ? ('true' as const) : undefined,
    'aria-describedby': describedBy(hint && ids.hint, error && ids.error),
    className: c.control,
  };
  return (
    <div className={cn(c.root, className)}>
      <label htmlFor={ids.control} className={c.label}>
        {label}
        {required ? null : <span className={c.optional}>{` (${optionalText})`}</span>}
      </label>
      {hint ? <p id={ids.hint} className={c.hint}>{hint}</p> : null}
      {type === 'textarea' ? (
        <textarea {...common} rows={5} defaultValue={value ?? ''} />
      ) : type === 'select' ? (
        <select {...common} defaultValue={value ?? ''}>
          <option value="">{placeholderOption}</option>
          {(options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input {...common} type={type} defaultValue={value || undefined} />
      )}
      {error ? <p id={ids.error} className={c.error}>{error}</p> : null}
    </div>
  );
}
