/**
 * Button Atom Component
 * 
 * Reusable button component with multiple variants.
 * Follows the design system established in Figma.
 * 
 * @param variant - Visual style variant ('primary' | 'secondary' | 'ghost')
 * @param size - Size variant ('default' | 'small')
 * @param children - Button content
 * @param onClick - Click handler
 * @param className - Additional custom classes
 * @param disabled - Disabled state
 * @param ariaLabel - Accessibility label
 * @param ariaPressed - For toggle buttons
 */

import { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'small';
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  ariaPressed?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'default',
  children,
  onClick,
  className = '',
  disabled = false,
  ariaLabel,
  ariaPressed,
}: ButtonProps) {
  // Base styles
  const baseStyles = 'font-bold transition-all flex items-center justify-center gap-2';
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-[#3f8cff] hover:bg-[#3f8cff]/90 text-white shadow-[0px_6px_12px_0px_rgba(63,140,255,0.26)]',
    secondary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'bg-transparent text-muted-foreground hover:bg-accent',
  };
  
  // Size styles
  const sizeStyles = {
    default: 'h-[48px] text-[16px] rounded-[14px] px-6',
    small: 'h-auto text-sm rounded-[10px] px-3 py-1.5',
  };
  
  // Disabled styles
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${disabledStyles}
    ${className}
  `.trim();

  return (
    <button
      onClick={onClick}
      className={combinedClassName}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
    >
      {children}
    </button>
  );
}
