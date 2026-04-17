/**
 * NotificationBell Atom Component
 * 
 * A notification bell icon with optional badge counter.
 * Pure presentational component.
 * 
 * @param count - Number of notifications (0 = hidden badge)
 * @param onClick - Callback when bell is clicked
 * @param ariaLabel - Accessibility label
 */

import { Bell } from 'lucide-react';

interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
  ariaLabel?: string;
}

export function NotificationBell({ 
  count = 0, 
  onClick,
  ariaLabel 
}: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || `Notifications${count > 0 ? ` (${count})` : ''}`}
      className="relative w-[48px] h-[48px] bg-white rounded-[14px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)] flex items-center justify-center hover:bg-accent transition-colors"
    >
      <Bell className="w-6 h-6 text-foreground" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-destructive text-white text-xs font-semibold rounded-full flex items-center justify-center px-1.5">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}