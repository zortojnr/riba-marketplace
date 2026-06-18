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
| Backend framework | None for app data — Supabase as backend-as-a-service. A thin Vercel serverless layer (`api/`) exists solely for payment secret handling | No custom server to host/maintain for app data; Postgres \+ Auth \+ RLS cover the MVP's needs. Payment provider secret keys can't live in client code, so that one slice needs a server |
| Primary database | Supabase Postgres | Managed, RLS gives row-level security without a custom auth middleware layer |
| Cache | None yet | Not needed at current scale |
| Queue | None yet | Not needed at current scale |
| Auth provider | Supabase Auth (email/password now, Google OAuth scaffolded but not enabled) | Built-in session handling, integrates directly with RLS via `auth.uid()` |
| Hosting | Vercel (frontend \+ `api/` serverless functions) | `vercel.json` already configured for Vite output; `/api/(.*)` rewrite routes to the serverless functions |
| CI/CD | None yet | Manual deploy via Vercel git integration |
| Monorepo? | No | Single Vite app |

`zustand` and `swr` were installed but unused anywhere in `src/` — removed from `package.json`.

---

## PHASE 3 — BACKEND DESIGN

### 3.1 Database Design — `DONE` (schema written; confirm it's been run against your live Supabase project before trusting any of this in production)

Schema lives at `supabase/migrations/`, two files, run in order:

| File | Purpose |
| :---- | :---- |
| `0001_init.sql` | Five core tables: `profiles`, `stores`, `products`, `orders`, `order_items`, all RLS-enabled |
| `0002_admin_role.sql` | Adds `admin` as a valid `profiles.role` value plus admin-only read/update policies. Was previously sitting at the repo root instead of `supabase/migrations/` (wouldn't have been picked up by migration tooling from there) — moved into place. No signup flow grants this role; per the file's own comment, promote a user manually via the SQL Editor, never through app UI. |

| Table | Purpose | Key relationships |
| :---- | :---- | :---- |
| `profiles` | One row per auth user. Created automatically by a trigger (`handle_new_user`) the instant someone signs up via Supabase Auth. | `id` references `auth.users.id` |
| `stores` | One storefront per owner. | `owner_id` → `profiles.id` |
| `products` | Items a store sells. | `store_id` → `stores.id` |
| `orders` | A customer's order against a store. | `store_id` → `stores.id`, `customer_id` → `profiles.id` |
| `order_items` | Line items on an order, price/name snapshotted at order time. | `order_id` → `orders.id`, `product_id` → `products.id` |

Row Level Security is enabled on every table. The rule of thumb used throughout: storefronts and their products are publicly readable (anyone can browse a store without logging in), but only the owning row's `owner_id`/`customer_id` matching `auth.uid()` can write to it. Full policy text is in the migration files, don't re-derive it from memory, read the files.

### 3.2 API Contract — `DONE`

There is no REST API for app data. All data access goes through the Supabase JS client directly from the frontend, governed by RLS instead of an API authorization layer. This is a deliberate architecture choice for this project's scale, not an oversight.

The old `src/utils/api.ts` dead REST client (pointing at a nonexistent `localhost:3000/api`) and the dead `StoreContext.tsx` that was its last consumer have both been **deleted**. Every page now talks to Supabase directly.

The one real server-side surface is `api/payments/paystack/` (Vercel serverless functions) — see Phase 6 below. It exists because Paystack's secret key can't be held in client code, not because the app needed a general-purpose API layer.

---

## PHASE 4 — FRONTEND DESIGN

### 4.1 Screen Map — `DONE`

| Route | Page | Status |
| :---- | :---- | :---- |
| `/` | HomePage | DONE (static landing, plus working "Demo Store Owner" / "Demo Customer" buttons — see Phase 5.1) |
| `/auth` | AuthPage | DONE (real signup/login) |
| `/onboarding` | OnboardingPage | DONE — inserts a real row into `stores`, validates the slug isn't taken |
| `/stores` | StoresPage | DONE (new) — public listing of active stores, filterable by `business_type` via `?type=` |
| `/store/:slug` | ProtectedStorePage | DONE — fetches the real store by slug and its real, available products via `CustomerAccessFlow`. Shows a real "Store Not Found" state for missing/inactive stores, no mock fallback |
| `/store/:slug/product/:productId` | SharedProductPage | DONE — fetches the real store and the real, available product scoped to that store. The share-link "token" concept it used to gate on never had a real backing (see below) and has been removed |
| `/cart` | CartPage | DONE (client-side cart logic, no backend dependency) |
| `/checkout` | CheckoutPage | DONE for pay-on-pickup — inserts a real `orders` row \+ `order_items`, `customer_id` from the session, redirects unauthenticated visitors to `/auth` with a return path. Paystack/Flutterwave radio options exist in the form but aren't wired to a real charge yet, see Phase 6 |
| `/dashboard` | DashboardPage | DONE for both views. Owner: real store, real product/order counts, redirects to `/onboarding` if no store exists yet. Customer: real active stores (linking to `/stores`/`/store/:slug`) and the customer's real order history, replacing the previous hardcoded arrays |
| `/products` | ProductsPage | DONE — real CRUD against `products`, scoped to the owner's store |
| `/orders` | OrdersPage | DONE — owners see orders against their store, customers see their own order history, both scoped via RLS rather than a frontend permission check |
| `/settings` | SettingsPage | DONE — loads and updates the owner's real `stores` row (name, business name, description, contact info, theme color). Currency/delivery-fee fields were dropped rather than faked, since those columns don't exist on `stores` |
| `/test` | ComprehensiveTestSuite | Fixed — only registered as a route when `import.meta.env.DEV` is true, so it no longer ships in production builds |

`src/pages/StorePage.tsx` (old dead duplicate of `ProtectedStorePage`) and `src/components/auth/EnhancedAuthForm.tsx` (zero imports anywhere) were both dead code, both deleted.

**Two related bugs found and fixed while wiring `SharedProductPage`:**
- `ShareProductLink` generated a share URL with a fake `?token=...` that `CustomerAccessFlow`'s old shared-link validator only ever accepted three hardcoded test strings for — every real generated link would have failed for anyone who opened it. There's no `shared_links` table or any other backing for a token concept, so it's been removed entirely; the share URL is now just the plain product URL (already publicly viewable via RLS, same as the storefront).
- `ProductDetailModal`'s share button hardcoded `businessSlug="demo-store"` / `businessName="Demo Fashion Hub"` regardless of which real store's product was open, so every "share this product" link pointed at the wrong store. `ProtectedStorePage` now passes the real store's slug/name through.
- Drive-by fix in the same code path: `ProtectedStorePage`'s `handleAddToCart` ignored the quantity selected in the product modal and always added 1 to the cart.

### 4.2 Known UI/Styling Inconsistencies — `DONE`

1. ~~README brand colors don't match the actual theme~~ — **Fixed.** `README.md` now says emerald `#0B6E4F` (matching `tailwind.config.js`) instead of the stale dark green `#0D2E27`.
2. ~~Global dark-mode background leak in `src/index.css`~~ — **Already fixed in an earlier pass.** The rule is scoped to `body.home-bg` (toggled by `HomePage` on mount/unmount), not a bare `html, body` selector.
3. **`src/index.css` is 1,956 lines.** Still true, still not audited line-by-line for dead/conflicting rules. Lower priority than the items above since it isn't actively causing a bug right now — flagged here so it doesn't get forgotten, not treated as blocking.
4. ~~Two components both named `ProductModal`~~ — **Fixed.** `src/components/store/ProductModal.tsx` → `ProductDetailModal.tsx` (customer-facing product view), `src/components/products/ProductModal.tsx` → `ProductFormModal.tsx` (owner's create/edit form). All imports updated.

### 4.3 UI States — `DONE`

Every screen should handle: loading, empty, error, and populated states. `ProtectedStorePage`, `ProductsPage`, `OrdersPage`, `DashboardPage` (both views), `SettingsPage`, `StoresPage`, and `SharedProductPage` now all have real loading spinners and real empty/not-found states instead of only ever rendering mock data.

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

redirects to wherever the user was headed (e.g. checkout), or role \= owner → /onboarding, role \= customer → /dashboard

Login (`signInWithPassword`) and logout (`signOut`) follow the same pattern. Session restoration on page load and cross-tab sync both go through `supabase.auth.onAuthStateChange`, implemented in `AuthContext.tsx`. `ProtectedRoute` and `CheckoutPage` both redirect to `/auth` with `state: { from: location }` when a session is required; `AuthContext` honors that return path after a successful login/signup instead of always landing on the role-based default page.

**Demo accounts** (`HomePage`'s "Demo Store Owner" / "Demo Customer" buttons, and `AuthForm`'s "Try Demo (Amina Bello)" button): `loginDemo(role)` creates a real, throwaway Supabase account for the requested role — previously both HomePage buttons silently created an **owner** account regardless of which one was clicked, this is fixed. A demo **owner** account is also auto-seeded with one store ("Amina's Fashion Hub") and three products so it lands on a populated, working dashboard immediately instead of bouncing through the onboarding form. A demo **customer** account lands on `/dashboard`'s customer view, which now shows real active stores and the customer's real (empty, until they order something) order history.

**Token strategy:**

- Access/refresh token lifetimes: managed by Supabase project defaults, not configured by the app  
- Storage: supabase-js default (localStorage). This is a deliberate, accepted tradeoff for this MVP, see the security checklist note below, not an oversight  
- "Demo" logins create real, throwaway Supabase accounts with generated credentials rather than fake local users. They're genuine signups, not mocks

**Email confirmation:** must be turned off in the Supabase project (Authentication → Providers → Email → "Confirm email") for the signup flow to return an immediate session. If this is re-enabled later for production, the signup flow needs a "check your email" UI state, which doesn't exist yet.

### 5.2 Authorization (who can do what) — `DONE` via RLS

| Role | Permissions |
| :---- | :---- |
| Guest (no session) | Can read any store where `is_active = true` and its available products. Cannot write anything. |
| Customer | Everything a guest can do, plus: can create orders under their own `customer_id`, can read their own orders and order items. Cannot read or modify other customers' orders, or any store/product data. |
| Owner | Can create one or more stores under their own `owner_id`. Can fully manage (create/update/delete) products belonging to their own stores. Can read and update the status of orders placed against their own stores. Cannot touch another owner's store, products, or orders. |
| Admin | Schema-level only (`0002_admin_role.sql`): read-only across `profiles`/`stores`/`products`/`orders`/`order_items`, plus store updates. No signup path grants this role and no UI consumes it yet — it exists for a human to promote themselves manually in the SQL Editor when platform moderation is needed. |

### 5.3 Security Checklist

**Backend (Postgres / Supabase):**

- [x] Input validation on the client via Zod schemas (`react-hook-form` \+ `@hookform/resolvers/zod`) before any write  
- [x] No SQL injection surface, all access through the Supabase client's parameterized query builder, no raw SQL from the frontend  
- [ ] Rate limiting on auth endpoints, not configured. Supabase has some default protections, but no custom rate limiting has been added  
- [x] CORS, handled by Supabase project settings, not something this app configures directly  
- [x] Secrets in env vars: `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are public by design (RLS is the real boundary). `SUPABASE_SERVICE_ROLE_KEY` and `PAYSTACK_SECRET_KEY` are server-only, no `VITE_` prefix, set in Vercel project settings, never committed  
- [x] `npm audit` run. 27 → 11 vulnerabilities after `npm audit fix` (no breaking changes applied). All 11 remaining are inside the `@vercel/node` dev-dependency tree (used only to build the `api/` serverless functions, not shipped to the browser) and only resolve via a breaking `@vercel/node@4.0.0` upgrade — left alone pending a deliberate decision to take that upgrade, not blocking  
- [ ] HTTPS-only enforcement in production, not yet verified on the Vercel deployment  
- [x] Passwords hashed, handled entirely by Supabase Auth, not something this app implements

**Frontend:**

- [ ] **Known tradeoff, not yet mitigated**: Supabase's default client stores the session (including refresh token) in `localStorage`, which is technically "sensitive data in localStorage." This is standard practice for Supabase apps and is mitigated by RLS enforcing authorization server-side regardless of token exposure, but it should be a conscious decision, not a default nobody looked at. If this app ever needs to defend against XSS-based session theft specifically, this is the line item to revisit (custom storage adapter, shorter token lifetimes).  
- [x] No `dangerouslySetInnerHTML` usage found with user-supplied content  
- [ ] CSP headers, not configured in `vercel.json`  
- [x] Auth tokens not passed in URL query params anywhere in the app  
- [x] Sensitive routes (`/dashboard`, `/products`, `/orders`, `/settings`, `/onboarding`) are wrapped in `ProtectedRoute`, which redirects to `/auth` (with a return path) when there's no session, and to `/dashboard` when the role doesn't match a route's `requireRole`.

---

## PHASE 6 — PAYMENTS

### 6.1 Paystack serverless integration — `IN PROGRESS` (backend built, not yet wired to the checkout UI)

Two Vercel serverless functions under `api/payments/paystack/`:

- `initialize.ts` — client will call this with an `orderId` after the order is inserted via direct Supabase access. Re-reads the order's real `total`/`currency`/`customer_email` from Supabase using the service-role key (never trusts a client-supplied amount), calls Paystack's `transaction/initialize` with the secret key held server-side, stores the returned reference on the order, and returns an `authorizationUrl` for the client to redirect to.
- `webhook.ts` — Paystack's webhook target. Verifies the HMAC signature over the raw request body, then re-verifies the transaction directly against Paystack's API (doesn't trust the webhook payload alone), then updates the matching order's `payment_status`/`payment_reference` via the service-role client.

`api/_lib/` holds the shared service-role Supabase client and a raw-body reader.

**Deliberately not wired into `CheckoutPage.tsx` yet** — per the working agreement, that happens only after a real test transaction (Paystack test card, test secret key) confirms the initialize → pay → webhook → `payment_status: 'paid'` round-trip actually works end to end. Until then, selecting "Pay with Paystack" or "Pay with Flutterwave" in checkout doesn't charge anyone or update payment status; only "Pay on Pickup" results in a real (unpaid) order today.

Flutterwave was deliberately not built — Paystack was picked as the first provider (see decision in conversation history), Flutterwave can follow the same pattern later if needed.

---

## REMAINING BUILD ROADMAP

In priority order, as agreed:

1. **Auth** — `DONE`. Signup, login, logout, session persistence, role-based redirect (with return-path support), RLS-backed authorization, working demo accounts for both roles.
2. **Store creation \+ product management** — `DONE`. `OnboardingPage` inserts a real `stores` row. `ProductsPage` does real CRUD against `products`, scoped to the owner's store. `DashboardPage`'s owner view shows real store/product/order counts.
3. **Customer browsing \+ cart \+ checkout** — `DONE` for the non-payment path. `ProtectedStorePage` fetches the real store and products by slug. `CheckoutPage` inserts real `orders` \+ `order_items` rows for pay-on-pickup orders. `CartPage`'s client-side logic is unchanged.
4. **Payments (Paystack)** — `IN PROGRESS`. Serverless `initialize`/`webhook` functions are built (Phase 6.1) but not yet wired into `CheckoutPage.tsx`'s UI — that's the next concrete step, gated on a confirmed test transaction.

Discovered along the way and now also done: `SharedProductPage`, `DashboardPage`'s customer view, and `SettingsPage` were all genuinely unbuilt (fully mock or non-functional) despite not being in the original four roadmap items — all three are now wired to real Supabase data (Phase 4.1). A new `/stores` page was added to support real "browse stores" links that previously pointed nowhere.

---

## DEFINITION OF DONE (per phase above)

A phase isn't done when the UI renders, it's done when:

- Data survives a page refresh (i.e., actually persisted in Supabase, not component state)  
- A second browser/incognito session sees the same data (proves it's not reading from localStorage pretending to be a backend)  
- RLS was tested by trying the disallowed case (e.g., logging in as Owner A and confirming Owner B's store is not editable), not just the happy path  
- The relevant route is unreachable without the correct auth state, where that matters
