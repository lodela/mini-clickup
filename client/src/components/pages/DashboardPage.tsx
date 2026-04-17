import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/contexts/SocketContext";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  LayoutDashboard,     // Dashboard - grid view
  Layers,              // Projects - stacked layers
  Calendar,            // Calendar
  Plane,               // Vacations - airplane
  Users,               // Employees - people
  MessageCircle,       // Messenger - chat bubble
  Folder,              // Info Portal - folder
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import logoSrc from "@/assets/images/logo.svg";
import supportSrc from "@/assets/images/support.svg";

/**
 * Dashboard Page Component
 *
 * Main application dashboard with sidebar navigation
 */
export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();
  const [sidebarOpen, setSidebarOpen] = useState(false);

   /**
    * Navigation items - Icons from Figma design
    */
   const navItems = [
     { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', highlight: false },
     { icon: Sparkles, label: 'Dashboard 2', path: '/dashboard-2', highlight: true },
     { icon: Layers, label: 'Projects', path: '/projects', highlight: false },
     { icon: Calendar, label: 'Calendar', path: '/calendar', highlight: false },
     { icon: Plane, label: 'Vacations', path: '/vacations', highlight: false },
     { icon: Users, label: 'Employees', path: '/team', highlight: false },
     { icon: MessageCircle, label: 'Messenger', path: '/chat', highlight: false },
     { icon: Folder, label: 'Info Portal', path: '/info', highlight: false },
   ];

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  /**
   * Navigate to page
   */
  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 glass border-r border-neutral-200
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
           {/* Logo */}
           <div className="p-6 border-b border-neutral-200">
             <div className="flex items-center gap-3">
               <img src={logoSrc} alt="Mini ClickUp Logo" width="30" height="30" />
               <h1 className="text-xl font-bold gradient-text">Mini ClickUp</h1>
             </div>
             <div className="flex items-center gap-2 mt-2">
               <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-destructive'}`} />
               <span className="text-xs text-neutral-500">
                 {isConnected ? 'Connected' : 'Disconnected'}
               </span>
             </div>
           </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
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
                        ? "bg-electric-blue/10 text-electric-blue font-medium"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }
                    ${item.highlight ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-200' : ''}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="absolute right-3 text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-semibold">
                      NEW
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

           {/* User Profile */}
           <div className="p-4 border-t border-neutral-200">
             <div className="flex items-center gap-3 mb-3">
               <div className="w-10 h-10 rounded-full bg-electric-blue text-white flex items-center justify-center font-semibold">
                 {user?.name?.charAt(0).toUpperCase() || 'U'}
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium text-neutral-900 truncate">
                   {user?.name || "User"}
                 </p>
                 <p className="text-xs text-neutral-500 truncate">
                   {user?.email || "user@example.com"}
                 </p>
               </div>
             </div>
             <Button
               variant="ghost"
               fullWidth
               leftIcon={<LogOut className="w-4 h-4" />}
               onClick={handleLogout}
             >
               Sign Out
             </Button>
           </div>

           {/* Support Section - Figma Design */}
           <div className="p-4">
             <img src={supportSrc} alt="Support" className="w-full h-auto" />
           </div>
         </div>
       </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 glass">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-electric-blue text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-neutral-100 rounded-lg">
              <Bell className="w-5 h-5 text-neutral-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
            <p className="text-neutral-500 mt-1">
              Welcome back, {user?.name || "User"}!
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Total Tasks"
              value="24"
              trend="+12%"
              trendUp={true}
              icon={CheckSquare}
              color="electric-blue"
            />
            <StatCard
              title="In Progress"
              value="8"
              trend="+3"
              trendUp={true}
              icon={FolderKanban}
              color="warning"
            />
            <StatCard
              title="Completed"
              value="16"
              trend="+89%"
              trendUp={true}
              icon={LayoutDashboard}
              color="success"
            />
            <StatCard
              title="Overdue"
              value="2"
              trend="-50%"
              trendUp={false}
              icon={Calendar}
              color="destructive"
            />
          </div>

          {/* Recent Activity */}
          <Card glass className="mb-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActivityItem
                  user="John Doe"
                  action="completed task"
                  target="Design homepage mockup"
                  time="2 hours ago"
                />
                <ActivityItem
                  user="Jane Smith"
                  action="commented on"
                  target="API integration"
                  time="4 hours ago"
                />
                <ActivityItem
                  user="Mike Johnson"
                  action="created task"
                  target="Fix navigation bug"
                  time="Yesterday"
                />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

/**
 * Stat Card Component
 */
interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ElementType;
  color: "electric-blue" | "success" | "warning" | "destructive";
}

function StatCard({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  color,
}: StatCardProps) {
  const colorClasses = {
    "electric-blue": "bg-electric-blue/10 text-electric-blue",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <Card glass hoverable>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">{title}</p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
            <p
              className={`text-xs mt-2 ${trendUp ? "text-success" : "text-destructive"}`}
            >
              {trend} from last week
            </p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Activity Item Component
 */
interface ActivityItemProps {
  user: string;
  action: string;
  target: string;
  time: string;
}

function ActivityItem({ user, action, target, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-medium">
        {user.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-neutral-900">
          <span className="font-medium">{user}</span>{" "}
          <span className="text-neutral-500">{action}</span>{" "}
          <span className="font-medium text-electric-blue">{target}</span>
        </p>
        <p className="text-xs text-neutral-400 mt-1">{time}</p>
      </div>
    </div>
  );
}
