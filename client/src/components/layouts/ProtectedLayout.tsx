import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Folder,
  CalendarDays,
  Plane,
  Users,
  MessageCircle,
  BookOpen,
  User,
  Settings,
  UsersRound,
  LogOut,
  Shield,
} from "lucide-react";
import { ProtectedLayoutTemplate } from "@/components/ui/templates/ProtectedLayoutTemplate";
import { SidebarOrganism } from "@/components/ui/organisms/SidebarOrganism";
import { HeaderOrganism } from "@/components/ui/organisms/HeaderOrganism";

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const mockUser = {
    name: user.name || "User",
    email: user.email || "",
    photo: user.avatar,
  };

  const navItems = [
    {
      id: "dashboard",
      label: t("nav.dashboard"),
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "projects",
      label: t("nav.projects"),
      icon: Folder,
      path: "/projects",
    },
    {
      id: "calendar",
      label: t("nav.calendar"),
      icon: CalendarDays,
      path: "/calendar",
    },
    {
      id: "vacations",
      label: t("nav.vacations"),
      icon: Plane,
      path: "/vacations",
    },
    {
      id: "employees",
      label: t("nav.employees"),
      icon: Users,
      path: "/employees",
    },
    {
      id: "messenger",
      label: t("nav.messenger"),
      icon: MessageCircle,
      path: "/messenger",
    },
    {
      id: "info-portal",
      label: t("nav.infoPortal"),
      icon: BookOpen,
      path: "/info-portal",
    },
  ];

  // Inyectar link de Admin si es GOD_MODE o si es tu email específico
  if (user.role === "GOD_MODE" || user.email === "nlodela@miniclickup.com") {
    navItems.push({
      id: "admin",
      label: "Admin",
      icon: Shield,
      path: "/admin/companies",
    });
  }

  const userMenuItems = [
    {
      label: t("user.profile"),
      icon: <User className="w-4 h-4" />,
      onClick: () => navigate("/profile"),
    },
    {
      label: t("user.settings"),
      icon: <Settings className="w-4 h-4" />,
      onClick: () => navigate("/settings"),
    },
    {
      label: t("user.teams"),
      icon: <UsersRound className="w-4 h-4" />,
      onClick: () => navigate("/teams"),
    },
    {
      label: t("user.signOut"),
      icon: <LogOut className="w-4 h-4" />,
      onClick: () => {
        // En un entorno profesional, aquí se llamaría a auth.logout()
        navigate("/login");
      },
    },
  ];

  return (
    <ProtectedLayoutTemplate
      isSidebarOpen={isSidebarOpen}
      sidebar={
        <SidebarOrganism
          navItems={navItems}
          currentPath={location.pathname}
          onNavigate={(path) => navigate(path)}
          onLogout={() => navigate("/login")}
          onSupport={() => console.log("Support clicked")}
        />
      }
      header={
        <HeaderOrganism
          user={mockUser}
          notificationCount={3}
          onSearch={(val) => console.log("Search:", val)}
          onNotificationClick={() => setIsSidebarOpen(!isSidebarOpen)}
          userMenuItems={userMenuItems}
        />
      }
    >
      <Outlet />
    </ProtectedLayoutTemplate>
  );
}
