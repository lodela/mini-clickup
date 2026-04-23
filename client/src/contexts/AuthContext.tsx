import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { api, ApiRequestError } from "@/services/api";

/**
 * User Interface
 */
export interface User {
  _id: string;
  email: string;
  name: string;
  role: 
    | "GOD_MODE" 
    | "CLIENT_A" | "CLIENT_B" | "CLIENT_C" 
    | "DIRECTOR" | "EXECUTIVE" | "MANAGER" 
    | "USER_A" | "USER_B" | "USER_C"
    | "user" | "admin"; // Fallbacks for legacy compatibility
  avatar?: string;
  companyId?: string;
  teams?: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Login Credentials
 */
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Register Data
 */
interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Auth Response from API
 */
interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
}

/**
 * Auth Context State
 */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  error: string | null;
  clearError: () => void;
}

/**
 * Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 *
 * Provides authentication state and methods to the application.
 * Handles login, register, logout, and token management.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if user is authenticated on mount
   */
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check authentication status
   */
  const checkAuth = async () => {
    try {
      const response = await api.get<AuthResponse>("/auth/me");
      if (response.data.success && response.data.data.user) {
        setUser(response.data.data.user);
      }
    } catch (_err) {
      // Expected when user is not authenticated — no action needed
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await api.post<AuthResponse>("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.data.success && response.data.data.user) {
        setUser(response.data.data.user);
        // Tokens are stored in HttpOnly cookies by backend
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (data: RegisterData) => {
    try {
      setError(null);
      setIsLoading(true);

      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await api.post<AuthResponse>("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.data.success && response.data.data.user) {
        setUser(response.data.data.user);
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (err: any) {
      const errorMessage =
        err instanceof ApiRequestError
          ? err.data?.message
          : err?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Clear user state regardless of API call success
      setUser(null);
    }
  }, []);

  /**
   * Update user data
   */
  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : null));
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 *
 * @returns Auth context with user state and methods
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Higher Order Component for protected routes
 */
export function withProtected<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  redirectTo: string = "/login",
) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      window.location.href = redirectTo;
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

export default AuthContext;
