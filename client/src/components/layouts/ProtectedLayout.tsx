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
} from "lucide-react";
import { ProtectedLayoutTemplate } from "@/components/ui/templates/ProtectedLayoutTemplate";
import { SidebarOrganism } from "@/components/ui/organisms/SidebarOrganism";
import { HeaderOrganism } from "@/components/ui/organisms/HeaderOrganism";

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  if (isLoading) {
    // Show a loader while checking auth
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    navigate("/login", { replace: true });
    return null; // Prevent rendering while redirecting
  }

  // Mock user data - in real app, this would come from useAuth()
  const mockUser = {
    name: user.name || "Evan Yates",
    email: user.email || "evan.yates@company.com",
    photo: user.avatar, // Would be actual photo URL
  };

  // Navigation items configuration
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

  // User menu items configuration
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
      onClick: handleLogout,
    },
  ];

  // Handlers
  function handleNavigate(path: string) {
    navigate(path);
  }

  function handleLogout() {
    // In real app, this would call auth.logout()
    console.log("Logout clicked");
    navigate("/login");
  }

  function handleSearch(value: string) {
    console.log("Search:", value);
    // Handle search functionality
  }

  function handleNotificationClick() {
    console.log("Notifications clicked");
    // Open notifications panel/modal
  }

  function handleSupportClick() {
    console.log("Support clicked");
    // Open support modal or navigate to support page
  }

  return (
    <ProtectedLayoutTemplate
      sidebar={
        <SidebarOrganism
          navItems={navItems}
          currentPath={location.pathname}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onSupport={handleSupportClick}
        />
      }
      header={
        <HeaderOrganism
          user={mockUser}
          notificationCount={3} // Mock notification count
          onSearch={handleSearch}
          onNotificationClick={handleNotificationClick}
          userMenuItems={userMenuItems}
        />
      }
    >
      <Outlet />
    </ProtectedLayoutTemplate>
  );
}
