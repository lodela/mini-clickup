# Mini ClickUp - Documentation Index

**Version:** 2.1.0  
**Last Updated:** 2026-05-04  
**Status:** MVP Development (Sprint 1 — Catalogos + Admin Context completed)

---

## 📚 Core Documentation

| # | Document | Description | Status |
|---|----------|-------------|--------|
| 00 | [00_Indice_General.md](./00_Indice_General.md) | **This index** | ✅ Activo |
| 02 | [02_Estado_Real_Actual.md](./02_Estado_Real_Actual.md) | **Estado real del proyecto (diagnóstico arquitectónico)** | ✅ Activo |
| 10 | [10_Roadmap_y_Deuda_Tecnica.md](./10_Roadmap_y_Deuda_Tecnica.md) | Roadmap and technical debt tracking | ✅ Activo |
| 11 | [11_Sprint_Plan.md](./11_Sprint_Plan.md) | Sprint plan S0–S5 con story points | ✅ Activo |
| 12 | [12_MVP_Work_Plan.md](./12_MVP_Work_Plan.md) | Plan de trabajo MVP (referencia histórica) | ✅ Activo |
| 13 | [13_Roadmap_Rescate_MVP.md](./13_Roadmap_Rescate_MVP.md) | **Roadmap de rescate — 5 fases, 29 épicas, inventario de bugs** | ✅ Activo |
| 14 | [14_Epicas_y_Criterios.md](./14_Epicas_y_Criterios.md) | **Épicas, historias y criterios de aceptación por pantalla** | ✅ Activo |
| 15 | [15_Vitacora_y_Auditoria.md](./15_Vitacora_y_Auditoria.md) | **Sistema de Vitácora — diseño completo del Activity Log** | 📐 Diseñado |
| 16 | [16_Figma_MCP_Setup.md](./16_Figma_MCP_Setup.md) | **Figma MCP server configuration + design tokens** | ✅ Activo |

### Documents to Create (Planned)

> These documents reference canonical single-source-of-truth files (AGENTS.md, INSTALLATION.md, etc.) and will be generated on demand when the corresponding module stabilizes:

| # | Document | Source of Truth | Priority |
|---|----------|-----------------|----------|
| 01 | Arquitectura_y_Stack | `AGENTS.md` + `INSTALLATION.md` | Medium |
| 03 | Componentes_Core | `client/src/components/AGENTS.md` | Low |
| 04 | Servicios_y_Red | `client/src/services/AGENTS.md` | Low |
| 05 | Utilidades_y_Hooks | `client/src/hooks/AGENTS.md` | Low |
| 06 | Testing_y_QA | Not started | Low |
| 07 | Build_Despliegue | `INSTALLATION.md` | Low |
| 08 | Internacionalizacion_i18n | `client/src/locales/AGENTS.md` | Low |
| 09 | Estado_Global_y_Contextos | `client/src/contexts/AGENTS.md` | Low |

---

## 🗂️ Additional Files

| File | Description |
|------|-------------|
| [E2E_PruebasQA.md](./E2E_PruebasQA.md) | End-to-end test plan and QA checklists |
| [DashboardPage.jpg](./DashboardPage.jpg) | Dashboard reference screenshot |
| [archive/](./archive/) | Historical sprint reports (Sprint 0–1 daily reports, MVP plan) |

---

## 📌 Canonical Sources of Truth (for Agents)

The following `AGENTS.md` files are the **machine-first authoritative reference** for each module. All agents **must** read the relevant file before modifying code in that directory:

### Server
| File | Module |
|------|--------|
| `AGENTS.md` (repo root) | **Main agent prompt — read first** |
| `server/src/AGENTS.md` | Employee module |
| `server/src/controllers/AGENTS.md` | Controller conventions |
| `server/src/models/AGENTS.md` | Mongoose schemas |
| `server/src/routes/AGENTS.md` | Route definitions |
| `server/src/services/AGENTS.md` | Business logic layer |
| `server/src/sockets/AGENTS.md` | Socket.IO architecture |
| `server/src/types/AGENTS.md` | TypeScript types/DTOs |
| `server/src/utils/AGENTS.md` | Error classes, utilities |
| `server/src/scripts/AGENTS.md` | DB seeding scripts |
| `server/src/middleware/AGENTS.md` | Auth/validation middleware |

### Client
| File | Module |
|------|--------|
| `client/src/AGENTS.md` | Client source overview |
| `client/src/components/AGENTS.md` | Component organization (Atomic Design) |
| `client/src/contexts/AGENTS.md` | Context providers |
| `client/src/hooks/AGENTS.md` | Custom hooks |
| `client/src/locales/AGENTS.md` | i18n translation files |
| `client/src/services/AGENTS.md` | API service layer |
| `client/src/styles/AGENTS.md` | Styling architecture |
| `client/src/types/AGENTS.md` | TypeScript definitions |

---

## 📋 Quick Links

- [Main README](../README.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Security Policy](../SECURITY.md)
- [Installation Guide](../INSTALLATION.md)
- [Code Review: SOLID](../CODE_REVIEW_SOLID.md)

---

**Project:** Mini ClickUp  
**Stack:** MERN + Socket.IO + React 19 + TypeScript + Tailwind CSS
