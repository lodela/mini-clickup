/**
 * UserMenuDropdown Molecule Component
 * 
 * User menu with avatar, name, and dropdown items.
 * Uses Radix UI for accessible dropdown.
 * 
 * @param user - User data (name, email, photo)
 * @param menuItems - Array of menu item configurations
 * @param onMenuItemClick - Callback when menu item is clicked
 */

import { ChevronDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { UserAvatar } from '../atoms/UserAvatar';

interface UserMenuDropdownProps {
  user: {
    name: string;
    email?: string;
    photo?: string;
  };
  menuItems: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }>;
}

export function UserMenuDropdown({ user, menuItems }: UserMenuDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center gap-3 h-[48px] px-4 bg-white rounded-[14px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)] hover:bg-accent transition-colors"
          aria-haspopup="menu"
          aria-label="User menu"
        >
          <UserAvatar src={user.photo} name={user.name} size={30} />
          <span className="font-bold text-[16px] text-foreground whitespace-nowrap">
            {user.name}
          </span>
          <ChevronDown className="w-5 h-5 text-foreground" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white rounded-[14px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.2)] p-2 z-50"
          sideOffset={8}
          align="end"
        >
          {menuItems.map((item, index) => (
            <DropdownMenu.Item
              key={index}
              onClick={item.onClick}
              className="flex items-center gap-3 px-4 py-3 rounded-[8px] text-[14px] text-foreground hover:bg-accent cursor-pointer outline-none transition-colors"
            >
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
