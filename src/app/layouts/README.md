# layouts/

Application shells that wrap routed pages with a `<router-outlet />`.

| Layout         | Used by                                                         |
| -------------- | --------------------------------------------------------------- |
| `auth-layout/` | Public pages: login, forgot password, OTP (implemented)         |
| `main-layout/` | Authenticated pages: header, sidebar menu, breadcrumb (planned) |

Rules

- May import from `@core/*` (session, language) and `@shared/*`.
- Must NOT import from `@features/*`. Features are attached through routes.
