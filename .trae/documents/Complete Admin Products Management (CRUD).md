## Research Summary
- Auth: `src/contexts/AuthContext.tsx` exposes `useAuth` and JWT flows.
- Notifications: `src/contexts/NotificationContext.tsx` exposes `useNotifications`.
- API client: `src/utils/api.ts` includes product CRUD (`getProducts`, `createProduct`, `updateProduct`, `deleteProduct`) and other endpoints.
- Types: `src/types/index.ts` contains `Product` and related domain types.
- Routes: `src/App.tsx` maps `/products`, `/orders`, `/settings`, `/onboarding` plus core routes.
- UI: Tailwind utility classes used across components; no `components/ui/Button/Input/Select/TextArea` found.
- Product components: store-facing `components/store/ProductList.tsx`, `ProductCard.tsx`, `ProductModal.tsx`; owner page `src/pages/ProductsPage.tsx` present.

## Implementation
1. Reconcile imports in `src/pages/ProductsPage.tsx` to use `src/utils/api.ts` and inline currency formatting (`Intl.NumberFormat`) or existing formatter if available.
2. Replace references to non-existent UI wrappers with semantic elements styled via Tailwind (consistent with existing components) to avoid introducing new files.
3. Unify product modal usage:
   - Prefer a single owner-edit modal under `components/products/ProductModal.tsx` (or reuse store modal with owner fields) and adjust imports accordingly.
4. Implement product list filtering and search client-side; categories derived from products.
5. Wire create/update/delete to `apiClient` endpoints; show success/error notifications via `useNotifications`.
6. CSV import/export:
   - Import: parse client-side `.csv` (name, description, price, currency, category, stock, image) and batch-create via API.
   - Export: generate `.csv` from current product list and trigger download.
7. Add availability and stock controls in modal; validate with `react-hook-form` + `zod` (reuse `AuthForm` patterns).
8. Connect Dashboard shortcuts to `/products`; ensure navigation back to dashboard.
9. Ensure mobile-first layout: grid cards, actions, and accessible controls.

## Verification
- Manual: run dev server, navigate to `/products`, create/edit/delete products, filter/search, import/export CSV.
- Tests: add unit tests for product filtering and modal validation; mock API client for CRUD flows.

## Risks & Assumptions
- Assumes product CRUD endpoints match `src/utils/api.ts` signatures; CSV endpoints may not exist—client-side implementation will be used initially.
- Avoids introducing new UI libraries; sticks to Tailwind classes.
- If a shared currency formatter exists, will use it; otherwise `Intl.NumberFormat` will be applied consistently.