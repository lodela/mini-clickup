/**
 * Logo Atom Component
 * 
 * A simple, presentational logo component that displays the company's brand mark.
 * This is a pure atom - no logic, no state, just visual representation.
 * 
 * @param variant - 'horizontal' for header, 'vertical' for sidebar
 * @param className - Optional additional CSS classes
 */

interface LogoProps {
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export function Logo({ variant = 'horizontal', className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`} data-variant={variant}>
      <div className="bg-[#3f8cff] rounded-[12px] w-[50px] h-[48px] flex items-center justify-center relative">
        {/* Blue square background */}
        <svg width="19" height="23" viewBox="0 0 19 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M0 2.5C0 1.11929 1.11929 0 2.5 0H16.5C17.8807 0 19 1.11929 19 2.5V20.5C19 21.8807 17.8807 23 16.5 23H2.5C1.11929 23 0 21.8807 0 20.5V2.5Z" 
            fill="white"
          />
        </svg>
        {/* Small 'd' letter */}
        <svg 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          width="14" 
          height="16" 
          viewBox="0 0 14 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M7 0C10.866 0 14 3.13401 14 7C14 10.866 10.866 14 7 14H0V0H7ZM7 2H2V12H7C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2Z" 
            fill="white"
          />
        </svg>
        {/* Small dot accent */}
        <svg 
          className="absolute top-[20%] right-[20%]"
          width="6" 
          height="6" 
          viewBox="0 0 6 6" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="3" cy="3" r="3" fill="white" />
        </svg>
      </div>
    </div>
  );
}
