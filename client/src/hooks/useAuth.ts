/**
 * Custom hook for authentication
 * 
 * Wrapper around AuthContext for easier access to auth methods
 * 
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export { useAuth } from '../contexts/AuthContext';
export type { User } from '../contexts/AuthContext';
