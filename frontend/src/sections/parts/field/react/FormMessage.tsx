// The message after a submit (a status after success, an alert after an error). Its text comes from the section's
// content; a page may pass its own as the section's message prop.
import type { ReactNode } from 'react';
import { cn } from '../../../recipes/cn';
import { messageClasses, messageRole, type FormStatus } from '../shared';

export interface FormMessageProps {
  status: FormStatus;
  id?: string;
  className?: string;
  children?: ReactNode;
}

export function FormMessage({ status, id, className, children }: FormMessageProps) {
  return (
    <div id={id} role={messageRole(status)} className={cn(messageClasses(status), className)}>
      {children}
    </div>
  );
}
