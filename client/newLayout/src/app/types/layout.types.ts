/**
 * Type definitions for Layout components
 * 
 * Shared interfaces and types used across the protected layout.
 */

import { LucideIcon } from 'lucide-react';

export interface User {
  name: string;
  email?: string;
  photo?: string;
  role?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: string | number;
  highlight?: boolean;
}

export interface MenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  divider?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}
