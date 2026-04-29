# 10 — Roadmap y Deuda Técnica

**Versión:** 1.0  
**Fecha:** 2026-04-29  
**Estado:** ✅ Activo — actualización continua  
**Propietario:** Norberto Lodela  

---

## Propósito

Este documento es el **registro oficial de deuda técnica y pendientes transversales** del proyecto Mini ClickUp.  
No contiene el diseño de features específicas (eso va en sus documentos propios), sino los **items de calidad, correcciones y mejoras sistémicas** que deben ejecutarse para garantizar estabilidad, seguridad y mantenibilidad en producción.

> **Regla:** Cada item debe tener estado claro (`✅ Resuelto`, `⏳ Pendiente`, `🔴 Bloqueante`, `🟡 Diferido`).

---

## 1. Seguridad & Warnings

### 1.1 DEP0169 — `url.parse()` deprecada en Node.js

| Campo | Detalle |
|-------|---------|
| **Prioridad** | 🟡 Diferido (no crítico hasta Node.js 26) |
| **Estado** | 🟡 Diferido — decisión documentada en sesión 2026-04-29 |
| **Origen** | Driver `mongodb` v6.x usa `url.parse()` internamente |
| **Solución definitiva** | Upgrade `mongoose@9` (usa `mongodb@7` que usa WHATWG URL API) |
| **Condición de desbloqueo** | Antes de merge a producción / rama `release` |

**Riesgo actual:** El warning aparece en consola pero **no es fatal** — ninguna vulnerabilidad activa con Node.js 22/24. Sí es fatal en Node.js 26+ cuando `url.parse()` sea removida.

**Opción temporal (si el warning es urgente antes de upgrade):**
```typescript
// server/src/index.ts — antes de cualquier import de mongoose
const _emit = process.emitWarning.bind(process);
process.emitWarning = (warning, ...args) => {
  if (typeof warning === 'string' && warning.includes('DEP0169')) return;
  _emit(warning, ...args);
};
```
> ⚠️ Usar solo como puente temporal. No sustituye el upgrade de mongoose.

**Decisión de sesión:** No parchear `node_modules` (anti-patrón). Upgrade a mongoose@9 cuando se integre la Fase A del Activity Log (mismo sprint, misma rama).

---

## 2. Internacionalización (i18n)

**Contexto:** Las dependencias de i18n (`i18next`, `react-i18next`, `i18next-browser-languagedetector`) están instaladas y `client/src/locales/index.ts` ya tiene `i18n.init()` con strings EN + ES. El problema es que **`main.tsx` nunca importa el módulo** — i18n nunca se inicializa en la app.

| # | Tarea | Estado |
|---|-------|--------|
| i18n-1 | Importar `@/locales` en `client/src/main.tsx` | ⏳ Pendiente |
| i18n-2 | Upgrade `react-i18next` v11 → v16 (compatible con `i18next@25`) | ⏳ Pendiente |
| i18n-3 | Agregar keys faltantes en `locales/index.ts` (forgotPassword, passwordRitual, etc.) | ⏳ Pendiente |
| i18n-4 | Aplicar `useTranslation()` a `LoginPage`, `ForgotPasswordPage`, `RegisterPage`, `ResetPasswordPage` | ⏳ Pendiente |
| i18n-5 | Verificar que `LanguageSwitcher.tsx` funciona correctamente después del fix | ⏳ Pendiente |

**Notas técnicas:**
- `react-i18next@11` tiene API diferente a v15+; puede haber breaking changes internos, verificar `Trans` y `useTranslation` hook
- El `LanguageSwitcher` ya existe en `client/src/components/ui/atoms/LanguageSwitcher.tsx`
- Los strings de login están hardcoded en inglés — después de i18n-4, deben usar keys

**Keys mínimas a agregar (EN + ES):**
```
forgotPassword.title
forgotPassword.subtitle
forgotPassword.emailLabel
forgotPassword.sendLink
forgotPassword.checkEmail
forgotPassword.apiMessage (dinámico — del servidor)
forgotPassword.spam
forgotPassword.tryAnother
forgotPassword.backToSignIn
passwordRitual.title
passwordRitual.remaining (con interpolación: {{count}} intento(s) restante(s))
passwordRitual.generate
passwordRitual.newPasswordLabel
passwordRitual.confirmLabel
```

---

## 3. Autenticación — AuthContext Path

| Campo | Detalle |
|-------|---------|
| **Prioridad** | 🔴 Bloqueante — el flujo de Password Ritual puede fallar silenciosamente |
| **Estado** | ⏳ Pendiente verificación |
| **Archivo** | `client/src/contexts/AuthContext.tsx` |

**Issue:** En sesiones anteriores se modificó `authController.ts` para que `passwordChangeRequired` esté anidado bajo `data`:
```json
{ "success": true, "data": { "user": {...}, "passwordChangeRequired": true } }
```

Si `AuthContext.tsx` aún lee `response.data.passwordChangeRequired` (ruta vieja) en lugar de `response.data.data.passwordChangeRequired` (ruta nueva), el Password Ritual **nunca se activa en el cliente** — falla silenciosamente.

**Acción:** Abrir `AuthContext.tsx`, buscar dónde se procesa la respuesta de login y confirmar la ruta. Corregir si es necesario y agregar un test E2E que valide el trigger del Password Ritual.

---

## 4. Dependencias del Cliente

### 4.1 Reconciliación de versiones

**Contexto:** El PM compartió un `package.json` de referencia con versiones más actualizadas. Comparación con estado actual:

| Paquete | Versión actual | Versión deseada | Acción |
|---------|---------------|-----------------|--------|
| `react-i18next` | `^11.18.6` | `^16.6.6` | ⏳ Upgrade |
| `lucide-react` | `^0.487.0` | `^1.7.0` | 🔍 Verificar si v1.x existe |
| `motion` | `^12.0.0` | `^12.38.0` | ⏳ Upgrade minor |
| `@radix-ui/*` | Varias versiones | Versiones más recientes | ⏳ Revisar |
| `@tailwindcss/typography` | ❌ No instalado | `0.5.19` | ⏳ Evaluar si se necesita |
| `dompurify` | ❌ No instalado | `3.3.3` | ⏳ Evaluar si se necesita |
| `chromadb` | ❌ No instalado | `3.4.0` | 🚫 No pertenece al cliente (RAG) |
| `@hey-api/client-fetch` | ❌ No instalado | `0.13.1` | 🚫 Evaluar necesidad |

**Notas:**
- `chromadb` NO debe ir en el cliente — es para el servidor RAG
- `dompurify` es útil si se renderizan HTML strings del usuario (sanitización)
- Priorizar `react-i18next` upgrade por bloquear el feature de i18n

### 4.2 Auditoría de seguridad

```bash
npm audit --prefix client
npm audit --prefix server
```
Ejecutar antes de cada release y resolver vulnerabilidades `high` y `critical`.

---

## 5. Bugs Conocidos

### 5.1 ForgotPasswordPage — Email enumeration ✅ RESUELTO

| Campo | Detalle |
|-------|---------|
| **Estado** | ✅ Resuelto — sesión 2026-04-29 |
| **Fix aplicado** | `client/src/components/pages/ForgotPasswordPage.tsx` |

**Descripción:** El estado de éxito mostraba hardcoded "We sent a password reset link to {email}" — revelando si el email existía en la DB (email enumeration). El API ya devolvía el mensaje correcto y seguro (`"If that email exists, you will receive a reset link."`).

**Fix:** Capturar `response.data.message` del API y mostrar ese mensaje en el UI. Anti-enumeration preservado: si el API devuelve 404 (email no existe), se muestra el mismo mensaje genérico.

---

## 6. Performance & Monitoreo

| Item | Estado | Notas |
|------|--------|-------|
| Bundle size analysis | ⏳ Pendiente | `npx source-map-explorer dist/assets/*.js` |
| Lazy loading de rutas protegidas | ⏳ Verificar | Router usa `lazy()` pero verificar cobertura |
| MongoDB query indexes | ⏳ Parcial | Los índices del Activity Log mejorarán esto |
| Rate limiting en auth endpoints | ⏳ Verificar | `express-rate-limit` instalado — confirmar config |

---

## 7. Testing

| Item | Estado | Target |
|------|--------|--------|
| Tests actuales | ✅ 46/46 passing | `npm --prefix server run test:run` |
| Coverage en activityLogService | ⏳ Pendiente | ≥ 80% cuando se implemente |
| E2E: Password Ritual flow | ⏳ Pendiente | Playwright — verificar trigger desde UI |
| E2E: Forgot Password flow | ⏳ Pendiente | Playwright — con email real o Mailtrap |
| E2E: Team creation + invite | ⏳ Pendiente | Playwright — flujo completo |

---

## 8. Historial de Decisiones Técnicas

| Fecha | Decisión | Racional |
|-------|----------|----------|
| 2026-04-29 | DEP0169: Diferir a pre-producción | El warning no es fatal en Node.js 22/24; parchear node_modules es un anti-patrón; upgrade de mongoose@9 es el fix correcto pero requiere sprint propio |
| 2026-04-29 | Anti-enumeration en ForgotPassword | El API ya implementaba el patrón correcto — solo había que conectar el UI al mensaje del servidor |
| 2026-04-17 | Eliminación de `App.tsx` del bundle | `App.tsx` no se usa — el entry point real es `main.tsx` → `router.tsx`. No borrar el archivo para no confundir el historial de git |

---

## Referencias

- `Documentacion/15_Vitacora_y_Auditoria.md` — pendientes del sistema de Activity Log
- `Documentacion/13_Roadmap_Rescate_MVP.md` — roadmap general del MVP
- `Documentacion/11_Sprint_Plan.md` — sprints planificados
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [npm audit documentation](https://docs.npmjs.com/cli/v9/commands/npm-audit)
