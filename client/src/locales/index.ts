import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

/**
 * English translations
 */
const en = {
  translation: {
    // Auth
    auth: {
      login: 'Sign In',
      register: 'Sign Up',
      logout: 'Sign Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      signUp: 'Create Account',
      signIn: 'Sign In',
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      confirm: 'Confirm',
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      stats: {
        totalTasks: 'Total Tasks',
        completedTasks: 'Completed Tasks',
        inProgressTasks: 'In Progress',
        overdueTasks: 'Overdue',
        totalProjects: 'Projects',
        activeProjects: 'Active',
        teamMembers: 'Team Members',
      },
      recentActivity: 'Recent Activity',
      upcomingDeadlines: 'Upcoming Deadlines',
    },

    // Navigation
    nav: {
      dashboard: 'Dashboard',
      projects: 'Projects',
      tasks: 'Tasks',
      team: 'Team',
      chat: 'Chat',
      calendar: 'Calendar',
      settings: 'Settings',
    },

    // Tasks
    tasks: {
      title: 'Tasks',
      addTask: 'Add Task',
      editTask: 'Edit Task',
      deleteTask: 'Delete Task',
      assignee: 'Assignee',
      reporter: 'Reporter',
      dueDate: 'Due Date',
      priority: 'Priority',
      status: 'Status',
      tags: 'Tags',
      description: 'Description',
      attachments: 'Attachments',
      comments: 'Comments',
      noTasks: 'No tasks found',
    },

    // Projects
    projects: {
      title: 'Projects',
      addProject: 'Add Project',
      editProject: 'Edit Project',
      deleteProject: 'Delete Project',
      description: 'Description',
      team: 'Team',
      members: 'Members',
      status: 'Status',
      startDate: 'Start Date',
      endDate: 'End Date',
      noProjects: 'No projects found',
    },

    // Team
    team: {
      title: 'Team',
      addMember: 'Add Member',
      inviteMember: 'Invite Member',
      role: 'Role',
      joinedAt: 'Joined At',
      noMembers: 'No team members',
    },

    // Validation
    validation: {
      required: 'This field is required',
      email: 'Please enter a valid email',
      minLength: 'Must be at least {{length}} characters',
      maxLength: 'Cannot exceed {{length}} characters',
      passwordMatch: 'Passwords do not match',
      passwordStrength: 'Password must be at least 8 characters',
    },

    // Errors
    errors: {
      generic: 'Something went wrong. Please try again.',
      notFound: 'Page not found',
      unauthorized: 'Please sign in to continue',
      network: 'Network error. Please check your connection.',
    },
  },
};

/**
 * Spanish translations
 */
const es = {
  translation: {
    // Auth
    auth: {
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      logout: 'Cerrar Sesión',
      email: 'Correo',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      fullName: 'Nombre Completo',
      rememberMe: 'Recordarme',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes una cuenta?',
      haveAccount: '¿Ya tienes una cuenta?',
      signUp: 'Crear Cuenta',
      signIn: 'Iniciar Sesión',
    },

    // Common
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      add: 'Agregar',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      close: 'Cerrar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      submit: 'Enviar',
      confirm: 'Confirmar',
    },

    // Dashboard
    dashboard: {
      title: 'Panel de Control',
      stats: {
        totalTasks: 'Total de Tareas',
        completedTasks: 'Completadas',
        inProgressTasks: 'En Progreso',
        overdueTasks: 'Atrasadas',
        totalProjects: 'Proyectos',
        activeProjects: 'Activos',
        teamMembers: 'Miembros del Equipo',
      },
      recentActivity: 'Actividad Reciente',
      upcomingDeadlines: 'Próximos Vencimientos',
    },

    // Navigation
    nav: {
      dashboard: 'Panel de Control',
      projects: 'Proyectos',
      tasks: 'Tareas',
      team: 'Equipo',
      chat: 'Chat',
      calendar: 'Calendario',
      settings: 'Configuración',
    },

    // Tasks
    tasks: {
      title: 'Tareas',
      addTask: 'Agregar Tarea',
      editTask: 'Editar Tarea',
      deleteTask: 'Eliminar Tarea',
      assignee: 'Responsable',
      reporter: 'Reportador',
      dueDate: 'Fecha Límite',
      priority: 'Prioridad',
      status: 'Estado',
      tags: 'Etiquetas',
      description: 'Descripción',
      attachments: 'Archivos Adjuntos',
      comments: 'Comentarios',
      noTasks: 'No se encontraron tareas',
    },

    // Projects
    projects: {
      title: 'Proyectos',
      addProject: 'Agregar Proyecto',
      editProject: 'Editar Proyecto',
      deleteProject: 'Eliminar Proyecto',
      description: 'Descripción',
      team: 'Equipo',
      members: 'Miembros',
      status: 'Estado',
      startDate: 'Fecha de Inicio',
      endDate: 'Fecha de Fin',
      noProjects: 'No se encontraron proyectos',
    },

    // Team
    team: {
      title: 'Equipo',
      addMember: 'Agregar Miembro',
      inviteMember: 'Invitar Miembro',
      role: 'Rol',
      joinedAt: 'Fecha de Ingreso',
      noMembers: 'No hay miembros del equipo',
    },

    // Validation
    validation: {
      required: 'Este campo es obligatorio',
      email: 'Por favor ingresa un correo válido',
      minLength: 'Debe tener al menos {{length}} caracteres',
      maxLength: 'No puede exceder {{length}} caracteres',
      passwordMatch: 'Las contraseñas no coinciden',
      passwordStrength: 'La contraseña debe tener al menos 8 caracteres',
    },

    // Errors
    errors: {
      generic: 'Algo salió mal. Por favor intenta de nuevo.',
      notFound: 'Página no encontrada',
      unauthorized: 'Por favor inicia sesión para continuar',
      network: 'Error de red. Verifica tu conexión.',
    },
  },
};

/**
 * i18n configuration
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      es,
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
