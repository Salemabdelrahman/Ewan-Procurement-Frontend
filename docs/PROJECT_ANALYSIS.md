# Project Analysis: Ewan Procurement Frontend

> **Purpose:** a single, complete description of this project so that a developer or an AI
> model can understand everything without scanning the codebase.
> **How to extend:** add to the relevant section, add a row to the change log (section 12),
> and update "Last updated". Keep facts verifiable; mark unknowns as _Open_.

**Last updated:** 2026-11-22 · **Phase:** 0 (Foundation) complete

---

## 1. Context

- **Business:** frontend for the company's **procurement (المشتريات)** system, part of the
  Ewan ERP family of apps.
- **Origin of the task:** the manager asked for (1) an Angular project structure following
  best practices, clean architecture and modular design; (2) shared components;
  (3) a git repo, personal for now until a company repo exists; (4) a login component as
  the first screen; (5) **first deliverable: the structure plus a full plan to review together.**
- **Backend:** not available yet. The login is UI only and makes no API calls.
- **Plan document:** [ARCHITECTURE_PLAN.md](ARCHITECTURE_PLAN.md) has the roadmap and the open decisions.

## 2. Tech stack and versions

| Item                                                              | Version | Notes                                                                                                               |
| ----------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| Node.js                                                           | 24.19.0 |                                                                                                                     |
| npm                                                               | 11.17.0 | pinned via `packageManager`                                                                                         |
| Angular (core, common, forms, router, platform-browser, compiler) | 22.3.0  | standalone components, **zoneless** (no `zone.js` dependency)                                                       |
| Angular CLI / `@angular/build`                                    | 22.3.0  | esbuild/Vite `application` builder                                                                                  |
| TypeScript                                                        | 6.0.3   | `baseUrl` is deprecated in TS 6, so `paths` use `./`-relative entries                                               |
| RxJS                                                              | 7.8.2   |                                                                                                                     |
| PrimeNG                                                           | 22.1.5  | **installed but not used**. Showed a PrimeUI license warning, pending confirmation. No `@primeuix/themes` installed |
| Vitest                                                            | 5.1.1   | via `@angular/build:unit-test`, jsdom 31 environment                                                                |
| Prettier                                                          | 3.8.1   | `printWidth 100`, single quotes, Angular HTML parser                                                                |

Not installed yet: ESLint, Husky, commitlint, i18n library, state library, CI.

## 3. Commands

```powershell
npm.cmd install
npm.cmd start                       # ng serve → http://localhost:4200 (development config)
npm.cmd run build                   # production build → dist/angular-foundation-project
npm.cmd test -- --watch=false       # Vitest, single run
npx prettier --write .              # format
```

Verified on 2026-11-22: production and development builds succeed; 5/5 tests pass.
Initial bundle is about 215 kB raw / 61 kB transferred. Login is a lazy chunk of about 47 kB.

## 4. Folder structure (actual)

```text
.
├─ angular.json              Build config. Development swaps environment.ts → environment.development.ts
├─ tsconfig.json             strict, strictTemplates, path aliases
├─ tsconfig.app.json / tsconfig.spec.json
├─ .prettierrc  .editorconfig  .gitignore  .vscode/
├─ public/                   Served as-is at the site root
│  ├─ favicon.ico
│  └─ assets/images/         about_ewan.jpg (login background), authlogo.png (logo)
├─ docs/
│  ├─ ARCHITECTURE_PLAN.md   Plan, roadmap and decisions (for review with the manager)
│  └─ PROJECT_ANALYSIS.md    This file
└─ src/
   ├─ index.html  main.ts  styles.scss
   ├─ assets/fonts/CairoRegular.ttf      Copied to /assets via angular.json
   ├─ environments/
   │  ├─ environment.model.ts            AppEnvironment { production, apiBaseUrl }
   │  ├─ environment.ts                  production: apiBaseUrl '/api'
   │  └─ environment.development.ts      dev: apiBaseUrl 'http://localhost:5000/api' (placeholder)
   └─ app/
      ├─ app.ts / app.html / app.scss    Root component, only <router-outlet />
      ├─ app.config.ts                   Providers: global error listeners, router, HttpClient
      ├─ app.routes.ts                   Root routes
      ├─ app.spec.ts
      ├─ core/
      │  ├─ README.md                    Layer rules
      │  └─ config/api-base-url.token.ts API_BASE_URL InjectionToken (root, from environment)
      ├─ shared/README.md                Layer rules. UI kit not built yet
      ├─ layouts/
      │  ├─ README.md
      │  └─ auth-layout/                 Full-screen background image + centered <router-outlet />
      └─ features/
         ├─ README.md                    Feature anatomy and rules
         └─ auth/
            ├─ auth.routes.ts            AUTH_ROUTES: 'login' (lazy), '' → 'login'
            └─ pages/login/              LoginPage component + spec
```

Folders that are documented but have no files yet (git does not track empty folders):
`core/interceptors|guards|services|models`, `shared/ui|directives|pipes|validators|utils|models`,
`layouts/main-layout`, `features/auth/data-access|state|models`.

## 5. Architecture

### 5.1 Layers and allowed imports

| Layer        | Alias         | Contains                                                       | May import                         |
| ------------ | ------------- | -------------------------------------------------------------- | ---------------------------------- |
| core         | `@core/*`     | Singletons: config tokens, interceptors, guards, root services | Angular, libs, `@env`              |
| shared       | `@shared/*`   | Stateless, business-agnostic UI, pipes, directives, utils      | Angular, UI lib, `@shared`         |
| layouts      | `@layouts/*`  | App shells with `<router-outlet />`                            | `@core`, `@shared`                 |
| features     | `@features/*` | One lazy folder per business domain                            | `@core`, `@shared`, its own folder |
| environments | `@env/*`      | Build-time config                                              | none                               |

Features never import each other. These rules are documented in each layer's README.md.
Automatic enforcement with ESLint is planned for Phase 1.

### 5.2 Feature anatomy (target)

`<feature>.routes.ts`, `pages/` (smart), `components/` (presentational), `state/`
(facade/signal store), `data-access/` (HTTP + DTO mappers), `models/`.
Direction: pages → state → data-access → models.

### 5.3 Routing (actual)

```text
''        → AuthLayout (loadComponent) + AUTH_ROUTES (loadChildren)
  'login' → LoginPage (loadComponent), title "Ewan ERP | Sign in"
  ''      → redirect 'login'
'**'      → redirect 'login'
```

The router uses `withComponentInputBinding()`, so route params bind to component `input()`s.

### 5.4 App providers (`app.config.ts`)

- `provideBrowserGlobalErrorListeners()`
- `provideRouter(routes, withComponentInputBinding())`
- `provideHttpClient(withFetch(), withInterceptors([]))`: interceptor list is empty and ready
  for `core/interceptors`.

## 6. Login page: detailed behavior

File: `src/app/features/auth/pages/login/login-page.ts` (+ `.html`, `.scss`, `.spec.ts`).

- **Form:** typed reactive `FormGroup` with `userName` (required), `password` (required),
  `rememberMe` (boolean). All controls are `nonNullable`.
- **State (signals):** `language` ('ar' default), `copy` (computed text for the current
  language), `showPassword`, `submitted`, `showServiceUnavailable`.
- **Submit:** marks everything touched. If invalid, shows "required" errors. If valid,
  shows a notice that no backend is connected. It never fakes a successful login.
- **i18n:** Arabic and English strings are hard-coded in a `LOGIN_COPY` constant inside the
  component. The toggle switches `dir`/`lang` **on the card only**, not on `<html>`.
  This is temporary and moves to the app-wide i18n solution in Phase 2.
- **Accessibility:** `<label for>`, `aria-invalid`, `aria-describedby`, `role="alert"` on
  errors, `role="status"` on the notice, `aria-label` on the password toggle, focus-visible
  outlines, `prefers-reduced-motion` respected in the layout.
- **UI:** native inputs with floating labels, an SVG eye icon, a gradient brand button and
  a language button. PrimeNG is not used.
- **Tests (3):** empty submit shows both errors; valid submit shows the "not connected"
  notice; language toggle switches to English/LTR.

## 7. Styling and design tokens

- Global `src/styles.scss`: Cairo `@font-face` (regular 400 only), box-sizing reset, base
  colors, plus these tokens on `:root`:
  `--ewan-brand #990c63`, `--ewan-brand-deep #7f0060`, `--ewan-title #10216c`,
  `--ewan-text #3d4149`, `--ewan-danger #f4516c`.
- Component styles are SCSS. The budget is a 4 kB warning / 8 kB error per component.
- RTL is handled with logical properties (`inset-inline-start`, `padding-inline`).
- _Open:_ the canonical brand color (`#990c63` vs `#a3257c` from the Core UI tokens).

## 8. Configuration notes

- `tsconfig.json`: `strict`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`,
  `noImplicitReturns`, `noFallthroughCasesInSwitch`, `isolatedModules`, `module: preserve`;
  Angular `strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`.
- `angular.json`: component prefix `app`, SCSS by default, initial budget 500 kB warning /
  1 MB error, assets from `public/` and `src/assets/`.
- `index.html`: `lang="en"`. It should be set dynamically by a language service (Phase 2).

## 9. Known gaps and technical debt

| #   | Item                                                                                      | Planned in  |
| --- | ----------------------------------------------------------------------------------------- | ----------- |
| 1   | No ESLint, import-boundary rules, git hooks, commitlint or CI                             | Phase 1     |
| 2   | Login text is hard-coded in the component, and language/direction does not apply app-wide | Phase 2     |
| 3   | No auth service, interceptors or guards                                                   | Phase 2 / 4 |
| 4   | No shared UI components yet. Login uses hand-written controls                             | Phase 3     |
| 5   | Login not connected to the API ("remember me" has no effect)                              | Phase 4     |
| 6   | No main layout (header/sidebar)                                                           | Phase 5     |
| 7   | PrimeNG installed but unused, pending a license decision                                  | Decision D1 |
| 8   | Only the Cairo Regular weight is loaded. Bold text is browser-synthesized or falls back   | Phase 3     |
| 9   | Git repo has no commits or remote yet                                                     | Immediately |

## 10. Decisions log

| Date       | Decision                                                                | Reason                                                                      |
| ---------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 2026-11-22 | Standalone + signals + zoneless, no NgModules                           | Angular 22 defaults and current style guide                                 |
| 2026-11-22 | Layers: core / shared / layouts / features, with path aliases           | Clean, modular structure with one-way dependencies                          |
| 2026-11-22 | Layouts moved out of `shared/` into their own `layouts/` layer          | Layouts are app shells that use core services; `shared` must stay stateless |
| 2026-11-22 | Feature routes exposed as `AUTH_ROUTES` and mounted with `loadChildren` | Each feature owns its routes and is lazy-loaded                             |
| 2026-11-22 | Native controls for login, PrimeNG not initialized                      | PrimeUI license warning seen in preview                                     |
| 2026-11-22 | `API_BASE_URL` token instead of importing `environment` in services     | Testability and swapping environments                                       |

Pending decisions D1 to D7 are listed in [ARCHITECTURE_PLAN.md §7](ARCHITECTURE_PLAN.md#7-decisions-needed).

## 11. Guidance for AI assistants and new developers

- Generate new code in the right layer (section 5). Use path aliases, not deep relative imports.
- New feature: create `features/<name>/<name>.routes.ts` exporting `<NAME>_ROUTES` and mount
  it in `app.routes.ts` with `loadChildren`.
- Components: standalone, `inject()`, `input()`/`output()`, signals, `@if`/`@for`, and file names
  without `.component` suffixes.
- Never call `HttpClient` from a page. Go through `data-access/` (and `state/` when it exists).
- Every user-facing string must support Arabic and English. Every layout must work in RTL.
- Run `npm.cmd run build` and `npm.cmd test -- --watch=false` before opening a PR.

## 12. Change log

| Date       | Change                                                                                                                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-22 | Phase 0: project created (Angular 22.3, PrimeNG dependency, Cairo font, Ewan assets), login page and auth layout built                                                                                                     |
| 2026-11-22 | Restructured into core/shared/layouts/features. Added path aliases, environments, `API_BASE_URL` token, HttpClient, `AUTH_ROUTES`, explicit `strict`/`strictTemplates`, layer READMEs, architecture plan and this analysis |
