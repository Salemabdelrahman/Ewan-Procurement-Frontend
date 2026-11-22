# shared/

Reusable, **stateless, business-agnostic** building blocks. Nothing here knows about
procurement, auth, or any backend endpoint.

| Folder        | What goes here                                                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `ui/`         | Presentational components: button, form-field, input, select, data-table, page-header, empty-state, confirm-dialog, loader, status-badge |
| `directives/` | Generic directives (autofocus, permission-based visibility, ...)                                                                         |
| `pipes/`      | Generic pipes (currency/date formatting, translate helpers, ...)                                                                         |
| `validators/` | Reusable form validators                                                                                                                 |
| `utils/`      | Pure helper functions                                                                                                                    |
| `models/`     | Generic UI types (table column definition, select option, ...)                                                                           |

Rules

- Components use `input()` / `output()` only. No injected data services, no HTTP.
- May import from: Angular, the chosen UI library, other `@shared/*` code.
- Must NOT import from `@core/*` services, `@features/*` or `@layouts/*`.
