# RIBA Project Blueprint

Single source of truth for the RIBA codebase. Filled out from the Master Full-Stack Framework template against the actual repository, not aspirational. Where something isn't built yet, it says so. Read this fully before changing code.

Status key used throughout: `DONE` working and verified, `IN PROGRESS` partially built, `PLANNED` not started, `BROKEN` exists but doesn't work, `STALE` exists but is wrong/outdated and should be corrected or removed.

---

## PHASE 0 — PROJECT DEFINITION

### 0.1 Project Snapshot

| Field | Answer |
| :---- | :---- |
| Project name | RIBA |
| One-line pitch | Mobile-first store builder for Nigerian businesses, quick menu and cart creation with shareable storefronts |
| Problem it solves | Small Nigerian businesses (food, retail, services) need a storefront and ordering flow they can stand up in minutes and share as a link, QR code, or flyer, without building a website |
| Primary users | Two roles: store owners (food vendors, retailers, service providers) and customers browsing/ordering from those stores |
| Success metric | TBD, set before public launch |
| Deadline | TBD |
| Team size | Solo (Zorto), AI-assisted (Claude / Claude Code) |

### 0.2 Tech Stack Decision

| Layer | Choice | Why |
| :---- | :---- | :---- |
| Frontend framework | React 19 \+ TypeScript \+ Vite (rolldown-vite) | Already built, fast dev loop, large ecosystem |
| Styling | Tailwind CSS v3 | Already built, utility-first, consistent with design tokens |
| Backend framework | None — Supabase as backend-as-a-service | No custom server to host/maintain; Postgres \+ Auth \+ RLS cover the MVP's needs |
| Primary database | Supabase Postgres | Managed, RLS gives row-level security without a custom auth middleware layer |
| Cache | None yet | Not needed at current scale |
| Queue | None yet | Not needed at current scale |
| Auth provider | Supabase Auth (email/password now, Google OAuth scaffolded but not enabled) | Built-in session handling, integrates directly with RLS via `auth.uid()` |
| Hosting | Vercel (frontend only) | `vercel.json` already configured for Vite output |
| CI/CD | None yet | Manual deploy via Vercel git integration |
| Monorepo? | No | Single Vite app |

Dependencies present in `package.json` worth noting: `zustand` and `swr` are installed but **unused anywhere in `src/`**. Either use them deliberately or remove them, don't leave dead weight in the dependency tree.

---

## PHASE 3 — BACKEND DESIGN

### 3.1 Database Design — `DONE` (schema written, not yet run against a live project)

Schema lives at `supabase/migrations/0001_init.sql`. Five tables:

| Table | Purpose | Key relationships |
| :---- | :---- | :---- |
| `profiles` | One row per auth user. Created automatically by a trigger (`handle_new_user`) the instant someone signs up via Supabase Auth. | `id` references `auth.users.id` |
| `stores` | One storefront per owner. | `owner_id` → `profiles.id` |
| `products` | Items a store sells. | `store_id` → `stores.id` |
| `orders` | A customer's order against a store. | `store_id` → `stores.id`, `customer_id` → `profiles.id` |
| `order_items` | Line items on an order, price/name snapshotted at order time. | `order_id` → `orders.id`, `product_id` → `products.id` |

Row Level Security is enabled on every table. The rule of thumb used throughout: storefronts and their products are publicly readable (anyone can browse a store without logging in), but only the owning row's `owner_id`/`customer_id` matching `auth.uid()` can write to it. Full policy text is in the migration file, don't re-derive it from memory, read the file.

### 3.2 API Contract — `IN PROGRESS`

There is no REST API. All data access goes through the Supabase JS client directly from the frontend, governed by RLS instead of an API authorization layer. This is a deliberate architecture choice for this project's scale, not an oversight.

`src/utils/api.ts` is a **leftover dead file**. It defines a REST client (`apiClient`) pointing at `http://localhost:3000/api`, a server that does not exist anywhere in this repo or in the Vercel config. Its auth methods (`login`, `signup`, `googleLogin`) have already been replaced by direct Supabase calls in `AuthContext.tsx`. The remaining methods (`getStoreBySlug`, `getProducts`, `createProduct`, `createOrder`, `initializePaystackPayment`, etc.) are still referenced by `StoreContext.tsx`, `ProductsPage.tsx`, and `OrdersPage.tsx`, and **will fail in production** because the endpoint doesn't exist. These need to be replaced with direct Supabase queries, table by table, as each phase below gets built. Don't patch `api.ts` to point somewhere new, delete the dead methods as you replace each one.

---

## PHASE 4 — FRONTEND DESIGN

### 4.1 Screen Map — `DONE` (routes exist, several render fake data)

| Route | Page | Status |
| :---- | :---- | :---- |
| `/` | HomePage | DONE (static landing) |
| `/auth` | AuthPage | DONE (real signup/login) |
| `/onboarding` | OnboardingPage | BROKEN — form validates, then fakes a 1.5s delay and discards everything. No store is ever created. |
| `/store/:slug` | ProtectedStorePage | BROKEN — ignores the slug, always renders a hardcoded "Demo Fashion Hub" with hardcoded products |
| `/store/:slug/product/:productId` | SharedProductPage | Uses mock data |
| `/cart` | CartPage | DONE (client-side cart logic, no backend dependency) |
| `/checkout` | CheckoutPage | BROKEN — order creation calls the dead `apiClient.createOrder` |
| `/dashboard` | DashboardPage | BROKEN — owner view and customer view both render hardcoded arrays (fake stores, fake recent orders) regardless of what the logged-in user actually owns |
| `/products` | ProductsPage | BROKEN — CRUD calls go through the dead `apiClient` |
| `/orders` | OrdersPage | BROKEN — same, dead `apiClient` |
| `/settings` | SettingsPage | Not yet audited against real data |
| `/test` | ComprehensiveTestSuite | Should not be a live production route. Move behind a dev-only flag or delete from `App.tsx` before launch. |

Also: `src/pages/StorePage.tsx` exists in the codebase but is **not referenced anywhere in `App.tsx`**. It's dead code from an earlier iteration, left behind when `ProtectedStorePage` replaced it. Confirm it's truly unused, then delete it rather than letting two competing "store page" implementations sit in the repo.

### 4.2 Known UI/Styling Inconsistencies — `STALE` / needs cleanup

These are concrete, verified issues, not stylistic opinions:

1. **`README.md`'s brand colors don't match the actual implemented theme.** The README says the brand is dark green `#0D2E27` with cream `#F3F1EA` accents. The actual `tailwind.config.js` primary palette and `DESIGN_SYSTEM.md` both use emerald `#0B6E4F` with gray neutrals, and that's what's actually rendered (e.g. `AuthPage.tsx` uses `emerald-50`/`emerald-100`). Pick one source of truth (the Tailwind config is the one actually running) and update the README to match.  
     
2. **A global dark-mode background leak in `src/index.css`.** Near the bottom of the file (around line 1866), under a comment that says "Landing page overflow and navbar transparency fixes," there's:  
     
   html, body {  
     
     background-color: \#0b1016;  
     
   }  
     
   .navbar, .navbar.scrolled {  
     
     background: \#0b1016 \!important;  
     
   }  
     
   This sets a near-black background on `html, body` globally, every page in the app, not just the landing page, despite the comment's intent. Every other page is designed with light backgrounds (`bg-gray-50`, `bg-gradient-to-br from-primary-50`). This needs to be scoped to the landing route specifically (a class on the landing page's root container, not a global element selector), not left as a blanket override.  
     
3. **`src/index.css` is 1,901 lines.** That's a lot of raw CSS sitting alongside a fully configured Tailwind setup, and it's the kind of file that accumulates conflicting overrides from multiple iterative AI-assisted sessions (there's a `.trae/documents/` folder in the repo root full of past UI-only prompt specs, confirming this history). Before adding more styling, audit this file for dead/conflicting rules rather than appending to it.  
     
4. **Two components are both named `ProductModal` in different folders** (`src/components/store/ProductModal.tsx` and `src/components/products/ProductModal.tsx`). They serve genuinely different purposes (one is the customer-facing product detail view, the other is the owner's create/edit form), so this isn't dead code, but the identical naming is a real source of confusion when navigating the codebase or wiring up imports. Rename them to reflect what they actually do, e.g. `ProductDetailModal` and `ProductFormModal`.

### 4.3 UI States — `PLANNED`

Every screen should handle: loading, empty, error, and populated states. Once real data replaces the mock arrays (Phase by phase below), audit each page against these four states, most currently only render the "populated with fake data" state and have never been tested against a genuine loading spinner or an empty store with zero products.

---

## PHASE 5 — AUTH & SECURITY

### 5.1 Authentication Flow — `DONE`

User submits signup form (name, email, phone, password, role)

        ↓

supabase.auth.signUp({ email, password, options: { data: { name, phone, role } } })

        ↓

Supabase creates a row in auth.users

        ↓

Database trigger \`handle\_new\_user\` fires automatically,

inserts a matching row into public.profiles with the role from signup metadata

        ↓

Supabase returns a session (access \+ refresh token) directly to the client

        ↓

supabase-js stores the session and handles refresh automatically

        ↓

AuthContext fetches the profiles row, maps it to the app's \`User\` type,

redirects: role \= owner → /onboarding, role \= customer → /dashboard

Login (`signInWithPassword`) and logout (`signOut`) follow the same pattern. Session restoration on page load and cross-tab sync both go through `supabase.auth.onAuthStateChange`, implemented in `AuthContext.tsx`.

**Token strategy:**

- Access/refresh token lifetimes: managed by Supabase project defaults, not configured by the app  
- Storage: supabase-js default (localStorage). This is a deliberate, accepted tradeoff for this MVP, see the security checklist note below, not an oversight  
- "Demo" login creates a real, throwaway Supabase account with generated credentials rather than a fake local user. It's a genuine signup, not a mock

**Email confirmation:** must be turned off in the Supabase project (Authentication → Providers → Email → "Confirm email") for the signup flow to return an immediate session. If this is re-enabled later for production, the signup flow needs a "check your email" UI state, which doesn't exist yet.

### 5.2 Authorization (who can do what) — `DONE` via RLS

| Role | Permissions |
| :---- | :---- |
| Guest (no session) | Can read any store where `is_active = true` and its available products. Cannot write anything. |
| Customer | Everything a guest can do, plus: can create orders under their own `customer_id`, can read their own orders and order items. Cannot read or modify other customers' orders, or any store/product data. |
| Owner | Can create one or more stores under their own `owner_id`. Can fully manage (create/update/delete) products belonging to their own stores. Can read and update the status of orders placed against their own stores. Cannot touch another owner's store, products, or orders. |

There is no separate "admin" role yet. If one is needed (e.g. for ColAI-style platform moderation), it needs its own policy additions, it does not exist in the current schema.

### 5.3 Security Checklist

**Backend (Postgres / Supabase):**

- [x] Input validation on the client via Zod schemas (`react-hook-form` \+ `@hookform/resolvers/zod`) before any write  
- [x] No SQL injection surface, all access through the Supabase client's parameterized query builder, no raw SQL from the frontend  
- [ ] Rate limiting on auth endpoints, not configured. Supabase has some default protections, but no custom rate limiting has been added  
- [x] CORS, handled by Supabase project settings, not something this app configures directly  
- [x] Secrets in env vars: `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` only, both are meant to be public (the anon key is safe to expose, RLS is the actual security boundary, not the key's secrecy)  
- [ ] `npm audit` has not been run as part of this work; package install showed 19 known vulnerabilities (1 low, 7 moderate, 11 high) in dependencies as of this writing. Needs a pass.  
- [ ] HTTPS-only enforcement in production, not yet verified on the Vercel deployment  
- [x] Passwords hashed, handled entirely by Supabase Auth, not something this app implements

**Frontend:**

- [ ] **Known tradeoff, not yet mitigated**: Supabase's default client stores the session (including refresh token) in `localStorage`, which is technically "sensitive data in localStorage." This is standard practice for Supabase apps and is mitigated by RLS enforcing authorization server-side regardless of token exposure, but it should be a conscious decision, not a default nobody looked at. If this app ever needs to defend against XSS-based session theft specifically, this is the line item to revisit (custom storage adapter, shorter token lifetimes).  
- [x] No `dangerouslySetInnerHTML` usage found with user-supplied content  
- [ ] CSP headers, not configured in `vercel.json`  
- [x] Auth tokens not passed in URL query params anywhere in the app  
- [ ] Sensitive routes (`/dashboard`, `/products`, `/orders`, `/settings`, `/onboarding`) have **no route guard**. Right now, an unauthenticated user can navigate directly to `/dashboard` and the page will render in whatever broken state results from `user` being `null` (mock data will likely still show, since those pages don't check auth state yet). A `ProtectedRoute` wrapper that redirects to `/auth` when there's no session needs to be added before any of these pages are wired to real, sensitive data.

---

## REMAINING BUILD ROADMAP

In priority order, as agreed:

1. **Auth** — `DONE`. Signup, login, logout, session persistence, role-based redirect, RLS-backed authorization. Requires a live Supabase project with the migration run and email confirmation disabled to actually function.  
2. **Store creation \+ product management** — `PLANNED`. Wire `OnboardingPage` to actually insert a row into `stores`. Wire `ProductsPage` to real CRUD against `products`, scoped to the owner's store. Wire `DashboardPage`'s owner view to show the real store and real product/order counts instead of hardcoded cards. Add the route guard mentioned in 5.3 first, these pages should not be reachable without a session.  
3. **Customer browsing \+ cart \+ checkout** — `PLANNED`. Wire `ProtectedStorePage` to fetch the real store by slug and its real products instead of the hardcoded "Demo Fashion Hub." Wire `CheckoutPage` to insert real `orders` \+ `order_items` rows. `CartPage`'s client-side logic can likely stay as-is, it doesn't depend on the dead API.  
4. **Payments (Paystack/Flutterwave)** — `PLANNED`. Stub functions exist in the dead `api.ts` but are called from nowhere in the UI. This needs actual integration: a payment step in checkout, webhook handling for payment confirmation (which will need a small serverless function, since client-side code can't safely hold payment provider secret keys), and `payment_status` updates on the `orders` table.

Cleanup items from Phase 4.2 and the dead `StorePage.tsx` / `api.ts` methods should be folded into whichever phase touches that code, not treated as a separate fifth phase, fix things as you pass through them.

---

## DEFINITION OF DONE (per phase above)

A phase isn't done when the UI renders, it's done when:

- Data survives a page refresh (i.e., actually persisted in Supabase, not component state)  
- A second browser/incognito session sees the same data (proves it's not reading from localStorage pretending to be a backend)  
- RLS was tested by trying the disallowed case (e.g., logging in as Owner A and confirming Owner B's store is not editable), not just the happy path  
- The relevant route is unreachable without the correct auth state, where that matters

