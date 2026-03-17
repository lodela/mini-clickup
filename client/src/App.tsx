import { Routes, Route } from 'react-router-dom';

// Lazy load pages for code splitting
import { lazy, Suspense } from 'react';

const LoginPage = lazy(() => import('./components/pages/LoginPage'));
const DashboardPage = lazy(() => import('./components/pages/DashboardPage'));
const ProjectsPage = lazy(() => import('./components/pages/ProjectsPage'));
const TasksPage = lazy(() => import('./components/pages/TasksPage'));
const TeamPage = lazy(() => import('./components/pages/TeamPage'));
const ChatPage = lazy(() => import('./components/pages/ChatPage'));
const CalendarPage = lazy(() => import('./components/pages/CalendarPage'));
const SettingsPage = lazy(() => import('./components/pages/SettingsPage'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
