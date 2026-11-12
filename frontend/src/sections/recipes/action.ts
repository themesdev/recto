import { cva, type VariantProps } from 'class-variance-authority';

// A link drawn as a button (parts/action). 44px tall: WCAG 2.5.8 asks 24, touch wants 44.
export const action = cva(
  // s-press: the tactile press, disabled and loading looks (site/styles/sections.css); the fills come from state.*.
  's-press inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-button px-5 text-size-base font-medium',
  {
    variants: {
      emphasis: {
        primary:
          'bg-primary text-primary-foreground on-hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_var(--state-hover-mix))] on-press:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_var(--state-press-mix))]',
        secondary: 'border border-border-strong text-foreground on-hover:bg-foreground/5 on-press:border-foreground on-press:bg-foreground/10',
      },
    },
    defaultVariants: { emphasis: 'primary' },
  },
);
export type ActionVariants = VariantProps<typeof action>;

