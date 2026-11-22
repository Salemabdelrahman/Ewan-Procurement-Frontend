# Ewan ERP Login UI

This project contains the Angular foundation and a standalone, frontend-only login screen styled to match the existing Ewan ERP applications. It does not authenticate users or connect to a backend.

## Stack

- Angular 22.3
- PrimeNG 22.1 is retained as a project dependency, but no PrimeNG component or theme is currently initialized.
- SCSS and standalone Angular components
- Cairo font and Ewan login assets

PrimeNG 22 showed a PrimeUI license warning during preview. Its components and theme are intentionally not initialized until the company confirms the licensing setup. The current login uses native form controls, matching the reference applications.

## Run locally

From PowerShell:

```powershell
npm.cmd install
npm.cmd start
```

Open `http://localhost:4200/`. To build or run unit tests:

```powershell
npm.cmd run build
npm.cmd test -- --watch=false
```

## Structure

```text
src/
  environments/        Build-time config (apiBaseUrl)
  app/
    core/              Singletons: config tokens, interceptors, guards, root services (@core/*)
    shared/            Stateless reusable UI kit, pipes, directives, utils (@shared/*)
    layouts/           App shells, e.g. auth-layout (@layouts/*)
    features/          One lazy-loaded folder per business domain (@features/*)
      auth/
        auth.routes.ts
        pages/login/
    app.config.ts
    app.routes.ts
  assets/fonts/
  styles.scss
docs/
  ARCHITECTURE_PLAN.md   Roadmap, conventions and open decisions
  PROJECT_ANALYSIS.md    Full project analysis (start here)
```

Each layer has a README.md with its import rules. Read [docs/PROJECT_ANALYSIS.md](docs/PROJECT_ANALYSIS.md) first.

The login styles in the reference projects use `#990c63` and `#7f0060`; a Core UI design-token file also uses `#a3257c` as the brand color. The login page follows the shared login-screen colors pending confirmation of the canonical company token.

## References

- [Angular style guide](https://angular.dev/style-guide)
- [PrimeNG installation](https://primeng.dev/installation)
- [PrimeNG theming](https://primeng.dev/theming)
