# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:4200
npm run build      # production build
npm test           # run tests (Karma + Jasmine, opens browser)
npm run watch      # build in watch mode (development)
```

Run a single test file:
```bash
npx ng test --include='src/app/services/auth.service.spec.ts'
```

## Architecture

Angular 20 standalone SPA — no NgModules. Backend REST API at `http://localhost:9001/api`.

**File naming convention:** `name.component.ts` / `name.service.ts` / `name.model.ts`. Styles always in `.scss`.

**Auth flow:** JWT token stored in `localStorage`. `AuthService.isLoggedIn` is a `signal`. `authGuard` protects `/transaction`. After login/register → `/transaction`, after logout → `/login`.

**HTTP interceptors** (registered in `app.config.ts`, in order):
1. `logging-interceptor` — disabled by default, toggle at runtime via `window.enableHttpLogging()` / `window.disableHttpLogging()` in browser console
2. `auth-interceptor` — attaches `Authorization: Bearer <token>` header

**Services** (`src/app/services/`):
- `auth.service.ts` — login, register, saveToken, logout, getToken, `isLoggedIn` signal
- `transaction.service.ts` — getAll, create, update, delete against `/api/transactions`

**Models** (`src/app/models/`):
- `auth.model.ts` — `AuthRequest`, `AuthResponse`
- `transaction.model.ts` — `TransactionRequest`, `Transaction` (extends request with `id`)

**Folder layout:**
- `src/app/components/` — routed page components (login, register, transactions)
- `src/app/modals/` — dialog components opened via `MatDialog` (transaction-dialog)
- `src/app/services/` — injectable services
- `src/app/interceptors/` — HTTP interceptors
- `src/app/guarda/` — route guards
- `src/app/models/` — TypeScript interfaces

**UI:** Angular Material (M3 theme, azure/blue palette). Global theme in `src/styles.scss`. Components use `inject()` pattern, `signal()` for state, `ReactiveFormsModule` for forms.

**`guarda/` folder** — note the non-standard spelling (not `guards/`).
