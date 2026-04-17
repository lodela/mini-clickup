import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import PageLoader from "./PageLoader";

/**
 * GuestLayout
 * Only accessible when the user is NOT authenticated.
 * Redirects to /dashboard if already logged in.
 */
export default function GuestLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}
