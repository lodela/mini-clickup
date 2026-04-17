/**
 * SearchInput Atom Component
 * 
 * A presentational search input field with icon.
 * Pure component - receives callbacks from parent.
 * 
 * @param placeholder - Placeholder text (should be translated)
 * @param value - Current search value
 * @param onChange - Callback when input changes
 * @param className - Optional additional CSS classes
 */

import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function SearchInput({ 
  placeholder, 
  value = '', 
  onChange, 
  className = '',
  ariaLabel 
}: SearchInputProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-4 w-5 h-5 text-foreground pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        className="w-full h-[48px] pl-12 pr-4 bg-white rounded-[14px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)] text-[16px] text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  );
}
