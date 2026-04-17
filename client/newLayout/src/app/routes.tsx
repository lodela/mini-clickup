/**
 * Application Routes Configuration
 * 
 * Uses React Router DOM v7 with createBrowserRouter (Data Router pattern).
 * Defines protected and public routes structure.
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CalendarPage } from './pages/CalendarPage';
import { VacationsPage } from './pages/VacationsPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { MessengerPage } from './pages/MessengerPage';
import { InfoPortalPage } from './pages/InfoPortalPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'projects',
        element: <ProjectsPage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'vacations',
        element: <VacationsPage />,
      },
      {
        path: 'employees',
        element: <EmployeesPage />,
      },
      {
        path: 'messenger',
        element: <MessengerPage />,
      },
      {
        path: 'info-portal',
        element: <InfoPortalPage />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-muted-foreground">Page not found</p>
        </div>
      </div>
    ),
  },
]);
