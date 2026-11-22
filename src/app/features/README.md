# features/

One folder per business domain (bounded context). Each feature is lazy-loaded and
self-contained. Layering inside a feature follows clean-architecture direction:
`pages → facade/state → data-access → models`.

```text
features/<feature>/
  <feature>.routes.ts     Lazy routes for the feature (exported as <FEATURE>_ROUTES)
  pages/                  Routed "smart" components; talk to the facade only
  components/             Feature-specific presentational components
  data-access/            HTTP API services and DTO ↔ model mappers
  state/                  Signal-based store / facade for the feature
  models/                 Domain types for this feature
```

Current and planned features

- `auth/` — login (implemented, UI only), forgot password, OTP (planned)
- `dashboard/`, `purchase-requests/`, `purchase-orders/`, `suppliers/`, `items/` — planned

Rules

- A feature may import from `@core/*`, `@shared/*` and its own folder only.
- Features never import from each other. Share via `@shared` or `@core`.
