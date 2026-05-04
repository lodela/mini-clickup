import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";

/**
 * Inner component that triggers the companies fetch on mount
 */
function AdminLayoutInner() {
  const { fetchCompanies } = useAdmin();

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return <Outlet />;
}

/**
 * AdminLayout
 *
 * Wraps all /admin/* routes with AdminProvider.
 * Follows the same pattern as GuestLayout / ProtectedLayout.
 */
export default function AdminLayout() {
  return (
    <AdminProvider>
      <AdminLayoutInner />
    </AdminProvider>
  );
}
