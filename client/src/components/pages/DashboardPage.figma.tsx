/**
 * Dashboard Page - Pixel-Perfect Implementation from Figma Design
 *
 * Design Source: CRM Woorkroom (Community) - Dashboard
 * Figma File: https://www.figma.com/design/IOYnTnClPHrmSnWFlKh96O
 * Node ID: 0-2
 *
 * Generated: 2026-03-19
 * Implementation: 100% Tailwind CSS + React + TypeScript
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/contexts/SocketContext";
import {
  Bell,
  Calendar,
  ChevronRight,
  LogOut,
  Menu,
  MoreHorizontal,
  Search,
  X,
  LayoutDashboard, // Dashboard
  Layers, // Projects
  Plane, // Vacations
  Users, // Employees
  MessageCircle, // Messenger
  Folder, // Info Portal
  Sparkles, // Dashboard 2 (NEW)
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Figma Design Assets
import logoSrc from "@/assets/images/logo.svg";
import userPhoto from "@/assets/figma-dashboard/user-photo-evan-yates.png";
import shawnStone from "@/assets/figma-dashboard/employee-shawn-stone.png";
import randyDelgado from "@/assets/figma-dashboard/employee-randy-delgado.png";
import emilyTyler from "@/assets/figma-dashboard/employee-emily-tyler.png";
import luisCastro from "@/assets/figma-dashboard/employee-luis-castro.png";
import blakeSilva from "@/assets/figma-dashboard/employee-blake-silva.png";
import joelPhillips from "@/assets/figma-dashboard/employee-joel-phillips.png";
import wayneMarsh from "@/assets/figma-dashboard/employee-wayne-marsh.png";
import oscarHolloway from "@/assets/figma-dashboard/employee-oscar-holloway.png";

/**
 * Navigation items from Figma design
 */
const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
    active: true,
  },
  {
    icon: Sparkles,
    label: "Dashboard 2",
    path: "/dashboard-2",
    active: false,
    highlight: true,
  },
  { icon: Layers, label: "Projects", path: "/projects" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: Plane, label: "Vacations", path: "/vacations" },
  { icon: Users, label: "Employees", path: "/team" },
  { icon: MessageCircle, label: "Messenger", path: "/chat" },
  { icon: Folder, label: "Info Portal", path: "/info" },
];

/**
 * Employee workload data from Figma
 */
const employees = [
  {
    id: 1,
    name: "Shawn Stone",
    role: "UI/UX Designer",
    level: "senior",
    photo: shawnStone,
    progress: 85,
  },
  {
    id: 2,
    name: "Randy Delgado",
    role: "UI/UX Designer",
    level: "junior",
    photo: randyDelgado,
    progress: 45,
  },
  {
    id: 3,
    name: "Emily Tyler",
    role: "Copywriter",
    level: "senior",
    photo: emilyTyler,
    progress: 90,
  },
  {
    id: 4,
    name: "Louis Castro",
    role: "Copywriter",
    level: "junior",
    photo: luisCastro,
    progress: 40,
  },
  {
    id: 5,
    name: "Blake Silva",
    role: "IOS Developer",
    level: "junior",
    photo: blakeSilva,
    progress: 35,
  },
  {
    id: 6,
    name: "Joel Phillips",
    role: "UI/UX Designer",
    level: "senior",
    photo: joelPhillips,
    progress: 95,
  },
  {
    id: 7,
    name: "Wayne Marsh",
    role: "Copywriter",
    level: "middle",
    photo: wayneMarsh,
    progress: 60,
  },
  {
    id: 8,
    name: "Oscar Holloway",
    role: "UI/UX Designer",
    level: "middle",
    photo: oscarHolloway,
    progress: 70,
  },
];

/**
 * Projects data from Figma
 */
const projects = [
  {
    id: "PN0001265",
    title: "Medical App (iOS native)",
    created: "Sep 12, 2020",
    status: "medium",
    totalTasks: 34,
    activeTasks: 13,
    assignees: [blakeSilva, userPhoto, oscarHolloway],
    hasMore: true,
  },
  {
    id: "PN0001221",
    title: "Food Delivery Service",
    created: "Sep 10, 2020",
    status: "medium",
    totalTasks: 50,
    activeTasks: 24,
    assignees: [blakeSilva, randyDelgado, emilyTyler],
    hasMore: false,
  },
  {
    id: "PN0001290",
    title: "Food Delivery Service",
    created: "May 28, 2020",
    status: "low",
    totalTasks: 23,
    activeTasks: 20,
    assignees: [blakeSilva, userPhoto, luisCastro],
    hasMore: true,
  },
];

/**
 * Events data from Figma
 */
const events = [
  {
    id: 1,
    title: "Presentation of the new department",
    time: "Today | 5:00 PM",
    priority: "medium",
  },
  {
    id: 2,
    title: "Anna's Birthday",
    time: "Today | 6:00 PM",
    priority: "low",
  },
  {
    id: 3,
    title: "Ray's Birthday",
    time: "Tomorrow | 2:00 PM",
    priority: "low",
  },
];

/**
 * Activity stream data from Figma
 */
const activities = [
  {
    id: 1,
    user: "Oscar Holloway",
    role: "UI/UX Designer",
    photo: oscarHolloway,
    action: "changed status from In Progress to Review",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: "Emily Tyler",
    role: "Copywriter",
    photo: emilyTyler,
    action: "commented on Medical App (iOS native)",
    time: "4 hours ago",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F4F9FD] overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Figma: Side Bar (0:3) */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[200px] bg-white border-r border-gray-100
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shadow-[0_6px_58px_0px_rgba(196,203,214,0.1)]
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo - Figma: Company's logo (0:47) */}
          <div className="p-6 pt-10">
            <div className="flex items-center gap-2">
              <img src={logoSrc} alt="Logo" className="w-[50px] h-[50px]" />
            </div>
          </div>

          {/* Menu - Figma: Menu (0:30) */}
          <nav className="flex-1 px-4 py-8 space-y-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`
                     w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                     transition-all duration-200 relative
                     ${
                       isActive
                         ? "bg-[#3F8CFF]/10 text-[#3F8CFF] font-semibold"
                         : "text-[#7D8592] hover:bg-gray-50"
                     }
                     ${item.highlight ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-200" : ""}
                   `}
                >
                  {/* Active indicator - Figma: elm/sidebar/indicator (0:42) */}
                  {isActive && (
                    <div className="absolute right-0 top-0 w-1 h-full bg-[#3F8CFF] rounded-r" />
                  )}
                  <IconComponent className="w-5 h-5" />
                  <span className="text-[16px] leading-[22px]">
                    {item.label}
                  </span>
                  {item.highlight && (
                    <span className="absolute right-3 text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-semibold">
                      NEW
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Support Section - Figma: Support (0:5) */}
          <div className="px-4 pb-4">
            <div className="bg-[#3F8CFF]/10 rounded-[24px] p-4">
              <div className="w-full h-[124px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-[24px] mb-3" />
              <Button className="w-full bg-[#3F8CFF] hover:bg-[#3F8CFF]/90 text-white font-semibold text-[16px] py-3 rounded-[10px]">
                Get Support
              </Button>
            </div>
          </div>

          {/* Logout - Figma: Logout (0:28) */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[#7D8592] hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-[16px] font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar - Figma: Account, Search, Notifications (0:57, 0:62, 0:70) */}
        <header className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-100">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Search - Figma: Search (0:62) */}
            <div className="relative">
              <div className="flex items-center bg-white border border-gray-200 rounded-[14px] px-5 py-3 shadow-[0_6px_58px_0px_rgba(196,203,214,0.1)]">
                <Search className="w-6 h-6 text-[#7D8592]" />
                <input
                  type="text"
                  placeholder="Search"
                  className="ml-3 text-[16px] text-[#7D8592] placeholder:text-[#7D8592] focus:outline-none w-[350px]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Period selector - Figma: Period (0:66) */}
            <div className="hidden md:flex items-center bg-[#E6EDF5] rounded-[14px] px-5 py-3">
              <Calendar className="w-6 h-6 text-white mr-3" />
              <span className="text-[16px] text-[#0A1629] font-normal">
                Nov 16, 2020 - Dec 16, 2020
              </span>
            </div>

            {/* Notifications - Figma: Notifications (0:70) */}
            <button className="relative p-3 bg-white border border-gray-200 rounded-[14px] hover:bg-gray-50 shadow-[0_6px_58px_0px_rgba(196,203,214,0.1)]">
              <Bell className="w-6 h-6 text-[#7D8592]" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {/* User Account - Figma: Account (0:57) */}
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-[14px] px-4 py-3 shadow-[0_6px_58px_0px_rgba(196,203,214,0.1)]">
              <img
                src={userPhoto}
                alt={user?.name || "User"}
                className="w-[30px] h-[30px] rounded-full object-cover border-2 border-white"
              />
              <span className="text-[16px] font-bold text-[#0A1629]">
                {user?.name || "Evan Yates"}
              </span>
              <ChevronRight className="w-6 h-6 text-[#7D8592]" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-10">
          {/* Page Title - Figma: Dashboard, Welcome back (0:73, 0:74) */}
          <div className="mb-8">
            <h1 className="text-[36px] font-bold text-[#0A1629] leading-[49px]">
              Dashboard
            </h1>
            <p className="text-[16px] text-[#7D8592] mt-2">
              Welcome back, {user?.name?.split(" ")[0] || "Evan"}!
            </p>
          </div>

          {/* Workload Section - Figma: Workload (0:75) */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-bold text-[#0A1629]">Workload</h2>
              <button className="flex items-center gap-2 text-[#3F8CFF] font-semibold text-[16px] hover:text-[#3F8CFF]/80">
                View all
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <Card className="bg-white rounded-[24px] shadow-[0_6px_58px_0px_rgba(196,203,214,0.1)] border-0">
              <CardContent className="p-6">
                {/* Employee Grid - 4 columns x 2 rows */}
                <div className="grid grid-cols-4 gap-6">
                  {employees.map((employee) => (
                    <div
                      key={employee.id}
                      className="bg-[#F4F9FD] rounded-[24px] p-5 flex flex-col items-center"
                    >
                      {/* Progress indicator - Figma: elm/general/progress */}
                      <div className="relative w-[58px] h-[58px] mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="29"
                            cy="29"
                            r="25"
                            stroke="#E4E6E8"
                            strokeWidth="6"
                            fill="none"
                          />
                          <circle
                            cx="29"
                            cy="29"
                            r="25"
                            stroke="#3F8CFF"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${(employee.progress / 100) * 157} 157`}
                            strokeLinecap="round"
                          />
                        </svg>
                        {/* Photo - Figma: elm/general/photo */}
                        <img
                          src={employee.photo}
                          alt={employee.name}
                          className="absolute inset-1 w-[50px] h-[50px] rounded-full object-cover"
                        />
                      </div>

                      {/* Name and Role */}
                      <h3 className="text-[16px] font-bold text-[#0A1629] text-center">
                        {employee.name}
                      </h3>
                      <p className="text-[14px] text-[#7D8592] mt-1">
                        {employee.role}
                      </p>

                      {/* Level indicator */}
                      <div className="mt-3 flex items-center gap-1">
                        <div
                          className={`w-[12px] h-[12px] rounded-full ${
                            employee.level === "senior"
                              ? "bg-green-500"
                              : employee.level === "middle"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <span className="text-[12px] text-[#7D8592] capitalize">
                          {employee.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Projects Section - Figma: Projects (0:153, 0:556, 0:954) */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-bold text-[#0A1629]">Projects</h2>
              <button className="flex items-center gap-2 text-[#3F8CFF] font-semibold text-[16px] hover:text-[#3F8CFF]/80">
                View all
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="bg-white rounded-[24px] shadow-[0_6px_58px_0px_rgba(196,203,214,0.1)] border-0 overflow-hidden"
                >
                  <CardContent className="p-6">
                    {/* Project Image */}
                    <div className="w-[48px] h-[48px] bg-[#E9EBF1] rounded-[10px] mb-4 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-[8px]" />
                    </div>

                    {/* Project Number */}
                    <p className="text-[14px] text-[#91929E] font-normal">
                      {project.id}
                    </p>

                    {/* Project Title */}
                    <h3 className="text-[18px] font-bold text-[#0A1629] mt-2 line-clamp-2">
                      {project.title}
                    </h3>

                    {/* Created Date */}
                    <div className="flex items-center gap-2 mt-3">
                      <Calendar className="w-4 h-4 text-[#7D8592]" />
                      <span className="text-[14px] text-[#7D8592] font-semibold">
                        Created {project.created}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] bg-[#E4E6E8] my-4" />

                    {/* Task Stats */}
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-[24px] font-bold text-[#0A1629]">
                          {project.totalTasks}
                        </p>
                        <p className="text-[14px] text-[#91929E]">All tasks</p>
                      </div>
                      <div>
                        <p className="text-[24px] font-bold text-[#0A1629]">
                          {project.activeTasks}
                        </p>
                        <p className="text-[14px] text-[#91929E]">
                          Active tasks
                        </p>
                      </div>
                    </div>

                    {/* Assignees */}
                    <div className="mt-4">
                      <p className="text-[14px] text-[#91929E] mb-2">
                        Assignees
                      </p>
                      <div className="flex -space-x-2">
                        {project.assignees.map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo}
                            alt="Assignee"
                            className="w-6 h-6 rounded-full border-2 border-white object-cover"
                          />
                        ))}
                        {project.hasMore && (
                          <div className="w-6 h-6 rounded-full bg-[#3F8CFF] border-2 border-white flex items-center justify-center">
                            <MoreHorizontal className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Bottom Section: Events & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nearest Events - Figma: Nearest Events (0:1357) */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[22px] font-bold text-[#0A1629]">
                  Nearest Events
                </h2>
                <button className="flex items-center gap-2 text-[#3F8CFF] font-semibold text-[16px] hover:text-[#3F8CFF]/80">
                  View all
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <Card className="bg-white rounded-[24px] shadow-[0_6px_58px_0px_rgba(196,203,214,0.1)] border-0">
                <CardContent className="p-6">
                  {events.map((event, index) => (
                    <div
                      key={event.id}
                      className={`relative pl-6 pb-6 ${
                        index !== events.length - 1 ? "mb-4" : ""
                      }`}
                    >
                      {/* Event indicator */}
                      <div
                        className={`absolute left-0 top-0 w-1 h-full rounded ${
                          event.priority === "medium"
                            ? "bg-[#3F8CFF]"
                            : "bg-[#DE92EB]"
                        }`}
                      />

                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-[16px] font-bold text-[#0A1629]">
                            {event.title}
                          </h3>
                          <p className="text-[14px] text-[#91929E] mt-2">
                            {event.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 flex items-center justify-center">
                            {event.priority === "medium" ? (
                              <div className="w-6 h-6 border-2 border-[#3F8CFF] rounded-full" />
                            ) : (
                              <div className="w-6 h-6 bg-[#DE92EB] rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* Activity Stream - Figma: Activity Stream (0:1390) */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[22px] font-bold text-[#0A1629]">
                  Activity Stream
                </h2>
                <button className="flex items-center gap-2 text-[#3F8CFF] font-semibold text-[16px] hover:text-[#3F8CFF]/80">
                  View more
                  <ChevronRight className="w-6 h-6 rotate-90" />
                </button>
              </div>

              <Card className="bg-white rounded-[24px] shadow-[0_6px_58px_0px_rgba(196,203,214,0.1)] border-0">
                <CardContent className="p-6">
                  {activities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className={`flex gap-4 pb-6 ${
                        index !== activities.length - 1
                          ? "mb-6 border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <img
                        src={activity.photo}
                        alt={activity.user}
                        className="w-[50px] h-[50px] rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="text-[16px] font-bold text-[#0A1629]">
                          {activity.user}
                        </h3>
                        <p className="text-[14px] text-[#91929E]">
                          {activity.role}
                        </p>
                        <p className="text-[14px] text-[#7D8592] mt-2">
                          {activity.action}
                        </p>
                        <p className="text-[12px] text-[#91929E] mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
