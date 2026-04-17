import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Header
      'header.search': 'Search',
      'header.notifications': 'Notifications',
      
      // Sidebar Navigation
      'nav.dashboard': 'Dashboard',
      'nav.projects': 'Projects',
      'nav.calendar': 'Calendar',
      'nav.vacations': 'Vacations',
      'nav.employees': 'Employees',
      'nav.messenger': 'Messenger',
      'nav.infoPortal': 'Info Portal',
      'nav.logout': 'Logout',
      'nav.support': 'Support',
      
      // User Menu
      'user.profile': 'Profile',
      'user.settings': 'Settings',
      'user.teams': 'Your teams',
      'user.signOut': 'Sign out',
      
      // Accessibility
      'aria.mainNav': 'Main navigation',
      'aria.globalSearch': 'Global search',
      'aria.notificationsCount': 'Notifications ({{count}})',
      'aria.userMenu': 'User menu',
    },
  },
  es: {
    translation: {
      // Header
      'header.search': 'Buscar',
      'header.notifications': 'Notificaciones',
      
      // Sidebar Navigation
      'nav.dashboard': 'Tablero',
      'nav.projects': 'Proyectos',
      'nav.calendar': 'Calendario',
      'nav.vacations': 'Vacaciones',
      'nav.employees': 'Empleados',
      'nav.messenger': 'Mensajería',
      'nav.infoPortal': 'Portal de Información',
      'nav.logout': 'Cerrar sesión',
      'nav.support': 'Soporte',
      
      // User Menu
      'user.profile': 'Perfil',
      'user.settings': 'Configuración',
      'user.teams': 'Tus equipos',
      'user.signOut': 'Cerrar sesión',
      
      // Accessibility
      'aria.mainNav': 'Navegación principal',
      'aria.globalSearch': 'Búsqueda global',
      'aria.notificationsCount': 'Notificaciones ({{count}})',
      'aria.userMenu': 'Menú de usuario',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
