# Ewan Procurement Frontend: Architecture Plan

**Status:** Draft for review · **Last updated:** 2026-11-22

This document proposes the structure, conventions and roadmap for the Angular frontend
of the procurement system. Phase 0 is done. Everything after it is a proposal to agree on
before implementation.

---

## 1. Goals

1. **Modular:** each business area (purchase requests, orders, suppliers, ...) is an
   independent, lazy-loaded feature that a developer can work on without touching others.
2. **Clean architecture:** dependencies point in one direction only, and UI is separated
   from business logic and from HTTP.
3. **Reusable shared components:** one shared UI kit so every screen looks and behaves the same.
4. **Arabic-first:** full RTL/LTR and Arabic/English support from day one.
5. **Enforced, not just documented:** lint rules, CI and PR checks keep the structure intact.

## 2. Technology baseline (current)

| Area        | Choice                                               | Notes           |
| ----------- | ---------------------------------------------------- | --------------- |
| Framework   | Angular 22.3 (standalone, signals, zoneless default) | No NgModules    |
| Language    | TypeScript 6.0 (`strict`, `strictTemplates`)         |                 |
| Build / dev | `@angular/build` (esbuild + Vite)                    |                 |
| Tests       | Vitest 5 + jsdom (Angular CLI unit-test builder)     |                 |
| Styling     | SCSS + CSS custom properties (design tokens)         |                 |
| Formatting  | Prettier + EditorConfig                              |                 |
| UI library  | PrimeNG 22 installed, **not used yet**               | See decision D1 |

## 3. Folder structure

```text
src/
  environments/                 Build-time config (apiBaseUrl, production flag)
  app/
    core/                       Singletons, no UI (@core/*)
      config/                   Injection tokens: API_BASE_URL, ...
      interceptors/             auth-token, error, language
      guards/                   authGuard, guestGuard, permissionGuard
      services/                 session, language/direction, notification
      models/                   ApiResponse<T>, Paged<T>, UserSession
    shared/                     Stateless, business-agnostic (@shared/*)
      ui/                       Shared UI kit (see section 5)
      directives/  pipes/  validators/  utils/  models/
    layouts/                    App shells (@layouts/*)
      auth-layout/              Public pages (exists)
      main-layout/              Header + sidebar + breadcrumb (planned)
    features/                   One folder per business domain (@features/*)
      auth/
        auth.routes.ts
        pages/login/            (exists, UI only)
        data-access/  state/  models/
      dashboard/
      purchase-requests/
      purchase-orders/
      suppliers/
      items/
    app.config.ts  app.routes.ts  app.ts
  styles/                       Global tokens, themes, RTL helpers (planned split of styles.scss)
```

### Layers inside a feature (clean architecture)

```text
pages/ (smart, routed)  →  state/ (facade / signal store)  →  data-access/ (HTTP + mappers)  →  models/
          ↘ components/ (presentational, feature-only)
```

- **Pages** read signals from the facade and call its methods. They never inject `HttpClient`.
- **State/facade** holds feature state with signals and coordinates use cases.
- **Data-access** is the only place that talks to the API. It maps backend DTOs to domain
  models, so a backend change touches one file.
- **Models** are plain TypeScript types with no Angular dependency.

### Dependency rules (to be enforced with ESLint)

| From ↓ / may import → | core | shared | layouts | features |
| --------------------- | :--: | :----: | :-----: | :------: |
| core                  |  ✓   |   ✗    |    ✗    |    ✗     |
| shared                |  ✗   |   ✓    |    ✗    |    ✗     |
| layouts               |  ✓   |   ✓    |    ✓    |    ✗     |
| features              |  ✓   |   ✓    |    ✗    | own only |

## 4. Conventions

- **Angular style guide (angular.dev, v20+):** file names without type suffixes
  (`login-page.ts`, not `login-page.component.ts`), one concept per file, `inject()` over
  constructor injection, `input()`/`output()`/`model()` signal APIs, built-in control flow
  (`@if`, `@for`), `OnPush`-friendly signal-based components.
- **Routing:** every feature exposes `<FEATURE>_ROUTES` and is mounted with `loadChildren`.
  Pages are lazy-loaded with `loadComponent`.
- **Path aliases:** `@core/*`, `@shared/*`, `@layouts/*`, `@features/*`, `@env/*`. No deep
  relative imports (`../../../`).
- **Forms:** typed reactive forms with `nonNullable` controls.
- **Selectors:** prefix `app-`.
- **Git:** `main` is protected. Work goes through `feature/*`, `fix/*` branches and PRs.
  Commit messages follow Conventional Commits (`feat(auth): add login api`).

## 5. Shared UI kit (planned)

Built once in `shared/ui/` on top of the chosen UI library (D1), styled with company tokens.

| Priority                      | Components                                                                                                                                                                  |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1 (needed for login)         | `form-field` (label, hint, error), `text-input`, `password-input`, `button`, `checkbox`, `language-switcher`, `alert`                                                       |
| P2 (needed for first screens) | `page-header`, `data-table` (sorting, paging, empty/loading states), `select`, `date-picker`, `status-badge`, `confirm-dialog`, `toast`, `loader`/`skeleton`, `empty-state` |
| P3                            | `file-upload`, `stepper` (approval workflow), `card`, `tabs`, `breadcrumb`                                                                                                  |

The current login page has hand-written inputs and buttons. In Phase 3 they move into
these shared components and the login page is rebuilt from them.

## 6. Roadmap

| Phase                           | Scope                                                                                                                                                                              | Output                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| **0 ✅ Foundation**             | Angular 22 app, layered structure, path aliases, environments, HTTP client, lazy auth feature, login UI, tests                                                                     | This repo                        |
| **1 Tooling**                   | ESLint (`angular-eslint`) + import-boundary rules, Husky + lint-staged, commitlint, CI pipeline (lint, test, build) on every PR                                                    | Structure enforced automatically |
| **2 Core**                      | Language service (sets `lang`/`dir` on `<html>`), i18n library (D2), session/auth service, interceptors (token, refresh, error, language), guards, global error and toast handling | App-wide infrastructure          |
| **3 Shared UI kit (P1)**        | Components from section 5, P1 row. Login rebuilt from them                                                                                                                         | First shared components          |
| **4 Auth complete**             | Login wired to backend API, remember me, logout, forgot password / OTP if required, route protection                                                                               | Working sign-in                  |
| **5 Main layout**               | Header, permission-driven sidebar menu, breadcrumb, user menu, dashboard placeholder                                                                                               | Authenticated shell              |
| **6 First procurement feature** | Purchase requests: list, details, create/edit form. Serves as the reference implementation for all later features                                                                  | Template for the team            |

## 7. Decisions needed

| #   | Question                     | Options                                                                                                                                 | Recommendation                                                                                      |
| --- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| D1  | UI component library         | (a) PrimeNG, after confirming the PrimeUI license warning seen in v22; (b) Angular Material + CDK; (c) custom components on Angular CDK | (a) if the license is fine, since it has the richest data table and forms for an ERP; otherwise (c) |
| D2  | Translation (Arabic/English) | (a) Transloco, switching language at runtime; (b) `@angular/localize`, one build per language                                           | (a), because users switch language without reloading                                                |
| D3  | State management             | (a) signal services (facade) only; (b) NgRx SignalStore (`@ngrx/signals`)                                                               | (b) for consistency across many procurement features                                                |
| D4  | Auth contract                | JWT + refresh token? Token storage? SSO?                                                                                                | Needs the backend team                                                                              |
| D5  | Git hosting and workflow     | GitHub / GitLab / Azure DevOps; reviewers; branch protection                                                                            | Until the company repo exists, a personal repo with the same PR flow                                |
| D6  | Brand color                  | `#990c63` (login screens) or `#a3257c` (Core UI tokens)                                                                                 | Confirm with design                                                                                 |
| D7  | Single app or workspace      | Single Angular app now, or an Nx monorepo if more Ewan apps will share the UI kit                                                       | Single app now; extract `shared/ui` into a library later if needed                                  |

## 8. References

- Angular style guide: https://angular.dev/style-guide
- Angular routing and lazy loading: https://angular.dev/guide/routing
- Angular signals: https://angular.dev/guide/signals
- PrimeNG: https://primeng.org
- Transloco: https://jsverse.github.io/transloco/
- NgRx SignalStore: https://ngrx.io/guide/signals
