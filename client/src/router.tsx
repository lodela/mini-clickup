/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import GuestLayout from "@/components/layouts/GuestLayout";

// ── Lazy pages ────────────────────────────────────────────────────────────────
// Suspense is handled inside ProtectedLayout / GuestLayout wrapping their Outlet.
const LoginPage = lazy(() => import("@/components/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/components/pages/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("@/components/pages/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("@/components/pages/ResetPasswordPage"),
);
const DashboardPage = lazy(() => import("@/components/pages/DashboardPage"));
const DashboardPageFigma = lazy(() => import("@/components/pages/DashboardPage.figma"));
const ProjectsPage = lazy(() => import("@/components/pages/ProjectsPage"));
const TasksPage = lazy(() => import("@/components/pages/TasksPage"));
const TeamPage = lazy(() => import("@/components/pages/TeamPage"));
const ChatPage = lazy(() => import("@/components/pages/ChatPage"));
const CalendarPage = lazy(() => import("@/components/pages/CalendarPage"));
const SettingsPage = lazy(() => import("@/components/pages/SettingsPage"));
const BacklogPage = lazy(() => import("@/components/pages/BacklogPage"));

// ── Router ────────────────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  // Guest-only routes — redirect to /dashboard if already authenticated
  {
    element: <GuestLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
    ],
  },

  // Protected routes — redirect to /login if not authenticated
  {
    element: <ProtectedLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/dashboard-2", element: <DashboardPageFigma /> },
      { path: "/projects", element: <ProjectsPage /> },
      { path: "/tasks", element: <TasksPage /> },
      { path: "/team", element: <TeamPage /> },
      { path: "/chat", element: <ChatPage /> },
      { path: "/calendar", element: <CalendarPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/backlog", element: <BacklogPage /> },
    ],
  },

  // Fallbacks
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);
