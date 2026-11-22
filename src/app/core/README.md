# core/

App-wide, **singleton** code that is created once and used everywhere. Never contains UI.

| Folder          | What goes here                                                         |
| --------------- | ---------------------------------------------------------------------- |
| `config/`       | Injection tokens and app config (`API_BASE_URL`, feature flags, ...)   |
| `interceptors/` | Functional HTTP interceptors (auth token, error handling, language)    |
| `guards/`       | Functional route guards (`authGuard`, `guestGuard`, `permissionGuard`) |
| `services/`     | Root services: session/auth state, language/direction, notifications   |
| `models/`       | Cross-cutting types (API response envelope, paging, user session)      |

Rules

- May import from: `@env`, Angular, third-party libs.
- Must NOT import from `@features/*` or `@layouts/*`.
- Everything here is `providedIn: 'root'` or registered in `app.config.ts`.
