/**
 * NavMenuItem Molecule Component
 * 
 * A navigation menu item with icon, label, and active state.
 * Composition of icon + text with styling.
 * 
 * @param icon - Lucide icon component
 * @param label - Menu item text
 * @param isActive - Whether this item is currently active
 * @param onClick - Callback when item is clicked
 */

import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavMenuItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
}

export function NavMenuItem({ 
  icon: Icon, 
  label, 
  isActive = false, 
  onClick,
  href 
}: NavMenuItemProps) {
  const baseClasses = "relative w-full flex items-center gap-3 px-6 py-3 rounded-[10px] transition-all text-[16px] font-semibold";
  const activeClasses = isActive 
    ? "bg-[#3f8cff]/10 text-[#3f8cff]" 
    : "text-[#7d8592] hover:bg-accent hover:text-foreground";

  const content = (
    <>
      {isActive && (
        <span className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#3f8cff] rounded-r-[2px]" />
      )}
      <Icon className="w-6 h-6 flex-shrink-0" />
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link
        to={href}
        className={`${baseClasses} ${activeClasses}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${activeClasses}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {content}
    </button>
  );
}
