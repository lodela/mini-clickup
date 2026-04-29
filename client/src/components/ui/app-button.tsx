/**
 * AppButton — reusable button aligned to the Mini ClickUp design system.
 *
 * Variants mirror the Figma-approved styles (same colour tokens and radius
 * as the Button atom used in SupportCard).
 *
 * Props:
 *   variant  - 'primary' | 'cancel' | 'danger' | 'ghost'   (default: 'primary')
 *   size     - 'sm' | 'default' | 'lg' | 'icon'            (default: 'default')
 *   loading  - shows spinner + disables the button
 *   leftIcon - ReactNode rendered before children
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const appButtonVariants = cva(
  // Base — matches Button atom base in SupportCard
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Design-system blue — same as SupportCard / Figma primary
        primary:
          'bg-[#3f8cff] text-white hover:bg-[#3f8cff]/90 active:bg-[#3476e0] shadow-[0px_6px_12px_0px_rgba(63,140,255,0.26)] focus-visible:ring-[#3f8cff]',
        // Outlined cancel — clearly visible, never ghost
        cancel:
          'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-slate-400',
        danger:
          'bg-red-500 text-white hover:bg-red-600 shadow-[0px_6px_12px_0px_rgba(239,68,68,0.26)] focus-visible:ring-red-500',
        ghost:
          'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-400',
      },
      size: {
        sm:      'h-9 text-sm rounded-[10px] px-4',
        default: 'h-[44px] text-[15px] rounded-[14px] px-6',
        lg:      'h-[48px] text-[16px] rounded-[14px] px-8',
        icon:    'h-10 w-10 rounded-[14px] p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface AppButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof appButtonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
}

export function AppButton({
  className,
  variant,
  size,
  loading,
  leftIcon,
  children,
  disabled,
  ...props
}: AppButtonProps) {
  return (
    <button
      className={cn(appButtonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {children}
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
