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
      welcomeBack: 'Welcome back! Please enter your details.',
      emailAddress: 'Email Address',
      signingIn: 'Signing in...',
      forgotPasswordTitle: 'Forgot Password?',
      forgotPasswordSubtitle: "No worries! Enter your email and we'll send you a link to reset your password.",
      sending: 'Sending...',
      sendResetLink: 'Send Reset Link',
      backToSignIn: 'Back to Sign In',
      checkYourEmail: 'Check your email',
      didntReceive: "Didn't receive the email? Check your spam folder or",
      tryAnotherAddress: 'try another address',
      setNewPassword: 'Set New Password',
      setNewPasswordSubtitle: 'Choose a strong password for your account.',
      newPassword: 'New Password',
      updating: 'Updating...',
      resetPassword: 'Reset Password',
      passwordReset: 'Password reset!',
      passwordResetSuccess: 'Your password has been updated. Redirecting to Sign In…',
      invalidResetLink: 'Invalid or expired reset link.',
      requestNewLink: 'Request a new one',
      resetFailed: 'Reset failed. The link may have expired.',
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      saving: 'Saving...',
      creating: 'Creating...',
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
      optional: 'Optional',
    },

    // Catalogs
    catalogs: {
      projectStatus: {
        planning: 'Planning',
        active: 'Active',
        'on-hold': 'On Hold',
        completed: 'Completed',
      },
      taskPriority: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        urgent: 'Urgent',
      },
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
      vacations: 'Vacations',
      employees: 'Employees',
      messenger: 'Messenger',
      infoPortal: 'Info Portal',
      support: 'Support',
      logout: 'Sign Out',
    },

    // User menu
    user: {
      profile: 'My Profile',
      settings: 'Settings',
      teams: 'My Teams',
      signOut: 'Sign Out',
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

    // Epics
    epics: {
      title: 'Epics',
      addEpic: 'Add Epic',
      editEpic: 'Edit Epic',
      deleteEpic: 'Delete Epic',
      name: 'Name',
      description: 'Description',
      status: 'Status',
      priority: 'Priority',
      noEpics: 'No epics found',
      viewStories: 'View Stories',
      createNewEpic: 'Create New Epic',
      newEpic: 'New Epic',
      manageEpics: 'Manage epics for this project',
      namePlaceholder: 'e.g. User Authentication Epic',
      descriptionPlaceholder: 'Describe the epic scope and goals...',
      createSuccess: 'Epic created successfully',
      createError: 'Failed to create epic',
      updateSuccess: 'Epic updated successfully',
      updateError: 'Failed to update epic',
      deleteSuccess: 'Epic deleted successfully',
      deleteError: 'Failed to delete epic',
      deleteConfirm: 'Are you sure you want to delete this epic?',
      editDescription: 'Update epic details.',
    },

    // Stories
    stories: {
      title: 'Stories',
      addStory: 'Add Story',
      editStory: 'Edit Story',
      deleteStory: 'Delete Story',
      title_field: 'Title',
      description: 'Description',
      status: 'Status',
      priority: 'Priority',
      sizing: 'Sizing',
      noStories: 'No stories found',
      createNewStory: 'Create New Story',
      newStory: 'New Story',
      manageStories: 'Manage stories for this epic',
      titlePlaceholder: 'e.g. As a user I want to...',
      descriptionPlaceholder: 'Describe the acceptance criteria...',
      createSuccess: 'Story created successfully',
      createError: 'Failed to create story',
      updateSuccess: 'Story updated successfully',
      updateError: 'Failed to update story',
      deleteSuccess: 'Story deleted successfully',
      deleteError: 'Failed to delete story',
      deleteConfirm: 'Are you sure you want to delete this story?',
      editDescription: 'Update story details.',
    },

    // Documents
    documents: {
      title: 'Documents',
      subtitle: 'Manage project documentation',
      newDocument: 'New Document',
      empty: 'No documents yet',
      loadError: 'Failed to load documents',
      saveError: 'Failed to save document',
      deleteError: 'Failed to delete document',
      deleteConfirm: 'Are you sure you want to delete this document?',
      titlePlaceholder: 'Document title',
      contentPlaceholder: 'Start writing...',
      selectOrCreate: 'Select a document or create a new one',
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
      passwordStrength: 'Password must be at least 10 characters',
      passwordRules: 'Must include uppercase, lowercase, number, and special char',
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
      welcomeBack: '¡Bienvenido! Por favor ingresa tus datos.',
      emailAddress: 'Correo Electrónico',
      signingIn: 'Iniciando sesión...',
      forgotPasswordTitle: '¿Olvidaste tu contraseña?',
      forgotPasswordSubtitle: '¡Sin problema! Ingresa tu correo y te enviaremos un enlace para restablecerla.',
      sending: 'Enviando...',
      sendResetLink: 'Enviar Enlace de Restablecimiento',
      backToSignIn: 'Volver a Iniciar Sesión',
      checkYourEmail: 'Revisa tu correo',
      didntReceive: '¿No recibiste el correo? Revisa tu carpeta de spam o',
      tryAnotherAddress: 'intenta con otro correo',
      setNewPassword: 'Establecer Nueva Contraseña',
      setNewPasswordSubtitle: 'Elige una contraseña segura para tu cuenta.',
      newPassword: 'Nueva Contraseña',
      updating: 'Actualizando...',
      resetPassword: 'Restablecer Contraseña',
      passwordReset: '¡Contraseña restablecida!',
      passwordResetSuccess: 'Tu contraseña ha sido actualizada. Redirigiendo al inicio de sesión…',
      invalidResetLink: 'Enlace inválido o expirado.',
      requestNewLink: 'Solicitar uno nuevo',
      resetFailed: 'Restablecimiento fallido. El enlace puede haber expirado.',
    },

    // Common
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      save: 'Guardar',
      saving: 'Guardando...',
      creating: 'Creando...',
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
      optional: 'Opcional',
    },

    // Catalogs
    catalogs: {
      projectStatus: {
        planning: 'Planificación',
        active: 'Activo',
        'on-hold': 'En Espera',
        completed: 'Completado',
      },
      taskPriority: {
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
        urgent: 'Urgente',
      },
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
      vacations: 'Vacaciones',
      employees: 'Empleados',
      messenger: 'Mensajería',
      infoPortal: 'Portal Info',
      support: 'Soporte',
      logout: 'Cerrar Sesión',
    },

    // User menu
    user: {
      profile: 'Mi Perfil',
      settings: 'Configuración',
      teams: 'Mis Equipos',
      signOut: 'Cerrar Sesión',
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

    // Epics
    epics: {
      title: 'Épicas',
      addEpic: 'Agregar Épica',
      editEpic: 'Editar Épica',
      deleteEpic: 'Eliminar Épica',
      name: 'Nombre',
      description: 'Descripción',
      status: 'Estado',
      priority: 'Prioridad',
      noEpics: 'No se encontraron épicas',
      viewStories: 'Ver Historias',
      createNewEpic: 'Crear Nueva Épica',
      newEpic: 'Nueva Épica',
      manageEpics: 'Gestionar épicas para este proyecto',
      namePlaceholder: 'ej. Épica de Autenticación de Usuario',
      descriptionPlaceholder: 'Describe el alcance y objetivos de la épica...',
      createSuccess: 'Épica creada exitosamente',
      createError: 'Error al crear la épica',
      updateSuccess: 'Épica actualizada exitosamente',
      updateError: 'Error al actualizar la épica',
      deleteSuccess: 'Épica eliminada exitosamente',
      deleteError: 'Error al eliminar la épica',
      deleteConfirm: '¿Estás seguro de que deseas eliminar esta épica?',
      editDescription: 'Actualiza los detalles de la épica.',
    },

    // Stories
    stories: {
      title: 'Historias',
      addStory: 'Agregar Historia',
      editStory: 'Editar Historia',
      deleteStory: 'Eliminar Historia',
      title_field: 'Título',
      description: 'Descripción',
      status: 'Estado',
      priority: 'Prioridad',
      sizing: 'Tamaño',
      noStories: 'No se encontraron historias',
      createNewStory: 'Crear Nueva Historia',
      newStory: 'Nueva Historia',
      manageStories: 'Gestionar historias para esta épica',
      titlePlaceholder: 'ej. Como usuario quiero...',
      descriptionPlaceholder: 'Describe los criterios de aceptación...',
      createSuccess: 'Historia creada exitosamente',
      createError: 'Error al crear la historia',
      updateSuccess: 'Historia actualizada exitosamente',
      updateError: 'Error al actualizar la historia',
      deleteSuccess: 'Historia eliminada exitosamente',
      deleteError: 'Error al eliminar la historia',
      deleteConfirm: '¿Estás seguro de que deseas eliminar esta historia?',
      editDescription: 'Actualiza los detalles de la historia.',
    },

    // Documents
    documents: {
      title: 'Documentos',
      subtitle: 'Gestiona la documentación del proyecto',
      newDocument: 'Nuevo Documento',
      empty: 'Aún no hay documentos',
      loadError: 'Error al cargar documentos',
      saveError: 'Error al guardar documento',
      deleteError: 'Error al eliminar documento',
      deleteConfirm: '¿Estás seguro de que deseas eliminar este documento?',
      titlePlaceholder: 'Título del documento',
      contentPlaceholder: 'Empieza a escribir...',
      selectOrCreate: 'Selecciona un documento o crea uno nuevo',
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
      passwordStrength: 'La contraseña debe tener al menos 10 caracteres',
      passwordRules: 'Debe incluir mayúscula, minúscula, número y carácter especial',
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
