Aquí está el checklist completo ordenado por flujo de uso:

---

# 🧪 QA Checklist — Mini ClickUp Sprint 1

> Las secciones marcadas con 🆕 tienen **cambios de esta sesión** — prioridad alta.

---

## 1. 🔐 LOGIN

### Smoke test (flujo normal)
- [ ] El formulario de login carga correctamente en `/login`
- [ ] Login con credenciales válidas → redirige al Dashboard
- [ ] Login con email incorrecto → muestra error (no revela si existe el usuario)
- [ ] Login con contraseña incorrecta → muestra error descriptivo
- [ ] Login con campos vacíos → validaciones inline visibles

### 🆕 Password Ritual — Login con contraseña temporal
- [ ] Login con usuario invitado (temp password) → **aparece el modal de cambio de contraseña** (no redirige al Dashboard)
- [ ] El modal muestra el aviso: **"Te quedan 3 intentos"** en el primer login
- [ ] El modal muestra el aviso: **"Te quedan 2 intentos"** en el segundo login (sin cambiar)
- [ ] El modal muestra **alerta roja / advertencia crítica** en el tercer login (último intento)
- [ ] Si se agotan los 3 usos sin cambiar → cuenta bloqueada / acceso denegado

---

## 2. 📝 REGISTRO (Self-service)

- [ ] Formulario de registro carga en `/register`
- [ ] Registro con email válido → flujo de OTP (verificación de correo)
- [ ] Registro con email ya existente → error descriptivo
- [ ] Validaciones de contraseña en registro (8 chars, mayúscula, número)

---

## 3. 🔄 FORGOT PASSWORD / RESET PASSWORD

- [ ] Link "Olvidé mi contraseña" funciona desde LoginPage
- [ ] Ingreso de email → mensaje de confirmación (sin revelar si existe)
- [ ] Link de reset en email → `/reset-password` carga correctamente
- [ ] Reset con token válido → permite nueva contraseña y redirige a login
- [ ] Reset con token expirado/inválido → error descriptivo

---

## 4. 🆕 MODAL DE CAMBIO DE CONTRASEÑA (Password Ritual)

> Este es el componente más nuevo y crítico del sprint.

### Generador de contraseñas
- [ ] Botón "Generar contraseña" produce una contraseña en el campo
- [ ] La contraseña generada tiene el formato: `Palabra_Palabra` con vocales reemplazadas (ej: `M1ckt3y_C@rt3r`)
- [ ] Cada clic genera una contraseña diferente (no siempre la misma)
- [ ] La contraseña generada pasa automáticamente la validación de fuerza

### Validación de contraseña
- [ ] **Mínimo 10 caracteres** — menos de 10 muestra error
- [ ] **Al menos 1 mayúscula** — sin mayúscula muestra error
- [ ] **Al menos 1 número** — sin número muestra error
- [ ] **Al menos 1 carácter especial de `[!#$%&_-?*@]`** — sin especial muestra error
- [ ] Un carácter especial fuera de la lista (ej: `$` no, `%` sí… validar todos)
- [ ] Contraseña válida → indicador verde / sin errores

### Flujo de cambio
- [ ] Ingresando contraseña válida y confirmación → botón "Cambiar contraseña" se habilita
- [ ] Confirmación ≠ contraseña → error "Las contraseñas no coinciden"
- [ ] Al cambiar exitosamente → modal cierra y se redirige al Dashboard con **acceso completo**
- [ ] No es posible cerrar el modal (X o backdrop) sin cambiar la contraseña

---

## 5. 🏠 DASHBOARD

- [ ] Carga correctamente después del login normal
- [ ] Carga correctamente después de completar el ritual de contraseña
- [ ] Muestra resumen / widgets de la app
- [ ] Navegación lateral visible y funcional

---

## 6. 👥 TEAMS (Equipos)

- [ ] Listado de equipos del usuario visible
- [ ] Crear nuevo equipo funciona
- [ ] Invitar miembro al equipo funciona
- [ ] Cambiar rol de miembro funciona
- [ ] Eliminar miembro del equipo funciona

---

## 7. 📁 PROJECTS (Proyectos)

- [ ] Listado de proyectos del equipo visible
- [ ] Crear nuevo proyecto funciona
- [ ] Editar proyecto funciona
- [ ] Cambiar estado del proyecto funciona

---

## 8. 📋 BACKLOG

- [ ] Backlog carga y muestra tareas sin sprint asignado
- [ ] Arrastrar / priorizar tareas en backlog funciona
- [ ] Crear tarea desde backlog funciona

---

## 9. ✅ TASKS (Tareas)

- [ ] Listado de tareas visible por proyecto/sprint
- [ ] Crear tarea funciona (formulario + validaciones)
- [ ] Asignar tarea a un usuario funciona
- [ ] Cambiar estado de tarea funciona (To Do → In Progress → Done)
- [ ] Cambiar prioridad funciona
- [ ] Convertir tarea a bug funciona
- [ ] Aprobar tarea para QA funciona

---

## 10. 🏃 SPRINT

- [ ] Crear sprint funciona
- [ ] Iniciar sprint funciona
- [ ] Mover tareas al sprint desde backlog funciona
- [ ] Completar sprint funciona

---

## 11. 📅 CALENDAR

- [ ] Página de calendario carga sin errores
- [ ] Muestra eventos/tareas con fechas asignadas

---

## 12. 💬 CHAT / MESSENGER

- [ ] Chat carga sin errores
- [ ] Mensajes en tiempo real (Socket.IO) funcionan entre dos usuarios

---

## 13. 🏖️ VACACIONES

- [ ] Página de vacaciones carga sin errores
- [ ] Funcionalidades básicas disponibles

---

## 14. ℹ️ INFO PORTAL

- [ ] Página carga sin errores
- [ ] Contenido visible

---

## 15. ⚙️ SETTINGS / PERFIL

- [ ] Página de configuración carga
- [ ] Editar nombre / avatar funciona
- [ ] Cambio de contraseña voluntario (desde settings) funciona y valida las mismas reglas

---

## 16. 🏢 ADMIN — EMPRESAS (God Mode) 🆕

> **Sección nueva — máxima prioridad de QA**

### Modal de creación de empresa
- [ ] El modal abre correctamente desde el botón en `AdminCompaniesPage`
- [ ] **Auto-focus**: el primer campo (nombre de empresa) tiene foco al abrir
- [ ] **Backdrop lock**: hacer clic fuera del modal **NO lo cierra**
- [ ] La X / botón cancelar sí cierra el modal
- [ ] Todos los campos tienen validación visible al dejar vacíos
- [ ] **Checkbox "Enviar invitación al usuario"** visible y funcionando

### Creación con invitación activada
- [ ] Llenar empresa + datos del admin + checkbox activado → crear empresa
- [ ] La empresa aparece en el listado después de crear
- [ ] **El usuario administrador invitado recibe un email** con contraseña temporal
- [ ] El email contiene las instrucciones del ritual de contraseña
- [ ] El usuario invitado puede hacer login con la contraseña temporal del email

### Creación sin invitación
- [ ] Checkbox desactivado → crear empresa sin enviar email
- [ ] La empresa se crea correctamente

---

## 17. 🏛️ ADMIN — DEPARTAMENTOS

- [ ] Listado de departamentos carga
- [ ] Crear departamento funciona
- [ ] Editar / eliminar departamento funciona

---

## 18. 🛡️ ADMIN — TEAMS (vista admin)

- [ ] Listado de equipos admin carga
- [ ] Gestión de equipos desde vista admin funciona

---

## 🔴 Puntos críticos — verificar primero

| # | Verificación | Por qué es crítico |
|---|-------------|-------------------|
| 1 | Login con temp password → modal aparece | Núcleo del sprint |
| 2 | Generador de contraseñas produce formato correcto | Feature nueva |
| 3 | Validación de 10 chars + especiales `[!#$%&_-?*@]` rechaza y acepta correctamente | Regex fue corregida |
| 4 | Crear empresa con invitación → email llega | Flujo completo God Mode |
| 5 | Backdrop del modal de empresa NO cierra | UX crítica |
| 6 | Después del ritual → acceso completo al Dashboard | Flujo de sesión |

---
