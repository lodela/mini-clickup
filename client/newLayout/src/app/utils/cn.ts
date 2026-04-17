/**
 * Class Name Utility
 * 
 * Combines clsx and tailwind-merge for optimal Tailwind class handling.
 * Use this instead of raw clsx when you need to merge Tailwind classes.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
