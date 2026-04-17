/**
 * useActiveRoute Hook
 * 
 * Utility hook to determine if a route is currently active.
 * Useful for highlighting navigation items.
 */

import { useLocation } from 'react-router-dom';

export function useActiveRoute(path: string): boolean {
  const location = useLocation();
  return location.pathname === path || location.pathname.startsWith(`${path}/`);
}
