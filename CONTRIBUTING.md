# Contributing to Mini ClickUp

Thank you for your interest in contributing to Mini ClickUp! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Git Workflow](#git-workflow)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)

---

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to maintain a welcoming and inclusive environment.

---

## Getting Started

1. **Fork the repository** (if external contributor)
2. **Clone your fork** locally
3. **Create a branch** for your feature or bug fix
4. **Make your changes** following our coding standards
5. **Run tests** to ensure everything works
6. **Submit a pull request**

---

## Git Workflow

### Branch Naming Convention

> ⚠️ **Regla:** Cada branch debe referenciar un issue de GitHub. Crea el issue primero, obtén su número, luego crea el branch.

```
feature/<issue-number>-<description>    # New features
bugfix/<issue-number>-<description>     # Bug fixes
hotfix/<issue-number>-<description>     # Critical production fixes
docs/<issue-number>-<description>       # Documentation changes
refactor/<issue-number>-<description>   # Code refactoring
chore/<issue-number>-<description>      # Maintenance tasks
test/<issue-number>-<description>       # Adding/updating tests
```

**Examples:**
```
feature/42-kanban-board
bugfix/21-fix-delete-team-500
hotfix/99-fix-auth-token-expiry
docs/5-update-readme
refactor/33-extract-button-component
chore/10-upgrade-react-19
```

**Branches protected (no convention required):**
- `main` — production branch, protected (no direct push)
- `develop` — integration branch
- `release/*` — release candidates

> 💡 A Husky `pre-push` hook automatically validates branch names before pushing. If validation fails, rename your branch: `git branch -m <new-name>`

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add login with email and password
fix(tasks): resolve drag-and-drop issue on mobile
docs(readme): update installation instructions
refactor(ui): extract button variants to CVA
chore(deps): upgrade React to 19.0.0
```

---

## Development Setup

### Prerequisites

- Node.js v24.10.0+
- npm v11.6.1+
- MongoDB v8.x
- Git v2.46.2+

### Initial Setup

```bash
# Clone repository
git clone git@github.com:<user>/mini-clickup.git
cd mini-clickup

# Install dependencies
npm install
cd client && npm install
cd ../server && npm install

# Setup environment variables
cp client/.env.example client/.env
cp server/.env.example server/.env

# Start development
npm run dev
```

---

## Making Changes

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make your changes** following coding standards

3. **Write tests** for new functionality

4. **Run linters and tests**:
   ```bash
   npm run lint
   npm run test
   ```

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat(scope): description of changes"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature
   ```

---

## Pull Request Process

1. **Create a Pull Request** from your branch to `main`

2. **Fill out the PR template** with:
   - Description of changes
   - Related issues
   - Testing performed
   - Screenshots (if UI changes)

3. **Ensure all checks pass**:
   - ESLint
   - Tests
   - Build

4. **Request review** from maintainers

5. **Address feedback** and update your PR

6. **Merge after approval**

---

## Coding Standards

### TypeScript

- Use strict mode
- Define explicit types for function parameters and return values
- Use interfaces for object shapes
- Avoid `any` type (use `unknown` if necessary)

### React

- Use functional components with hooks
- Follow Atomic Design principles
- Use TypeScript for all components
- Implement proper error boundaries

### CSS/Tailwind

- Use Tailwind utility classes
- Follow design system tokens
- Mobile-first responsive design
- Ensure accessibility (contrast, focus states)

### Backend

- Use async/await for asynchronous operations
- Implement proper error handling
- Follow RESTful API conventions
- Validate all inputs with Zod

---

## Testing Requirements

### Unit Tests

- Minimum 80% code coverage
- Test all utility functions
- Test component rendering
- Test API endpoints

### Integration Tests

- Test API endpoint combinations
- Test database operations
- Test authentication flows

### E2E Tests

- Test critical user paths
- Test authentication flow
- Test core features

### Running Tests

```bash
# Frontend tests
cd client
npm run test          # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage

# Backend tests
cd server
npm test

# E2E tests
cd client
npm run test:e2e
```

---

## Questions?

If you have questions, please:
- Check existing [documentation](Documentacion/00_Indice_General.md)
- Review [existing issues](https://github.com/lodela/mini-clickup/issues)
- Create a new issue for discussion

---

**Last Updated:** 2026-03-17
**Version:** 0.1.0
