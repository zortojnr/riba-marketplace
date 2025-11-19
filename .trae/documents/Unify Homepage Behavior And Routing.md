## Findings
- Primary homepage: `src/pages/HomePage.tsx` (marketing/landing with CTA)
- Router maps `/` → `HomePage` in `src/App.tsx:39`
- Logout redirects to `/` in `src/contexts/AuthContext.tsx:221`
- Authenticated landing: `src/pages/DashboardPage.tsx` (routed at `/dashboard` in `src/App.tsx:47` after recent changes)
- Duplicate dashboard variant: `src/pages/CustomerDashboardPage.tsx` (not routed; overlaps with `DashboardPage` customer view)
- Shell/Navigation differences: `src/components/layout/AppShell.tsx:23-25` hides secondary nav on `/`, while `src/components/layout/LayoutWrapper.tsx:13-18` still shows `NavigationBar` on `/`

## Why Two "Home" Experiences Appear
- After logout users see `/` → `HomePage` (public landing)
- While signed in, several flows show dashboard-like "home" (customer/owner) — perceived as a second homepage
- There is also an unused `CustomerDashboardPage.tsx` which increases confusion even if not directly routed

## Recommendation
- Keep `/` mapped to `HomePage.tsx` as the single public homepage
- Use `/dashboard` as the signed‑in homepage for customers; keep `/onboarding` for owners until setup, then to their store
- Remove/merge `CustomerDashboardPage.tsx` into `DashboardPage.tsx` to eliminate duplication
- Ensure all logo/back/logout consistently navigate to `/` when unauthenticated and to `/dashboard` when authenticated (via role‑aware logic where appropriate)
- Confirm legacy route `/home` remains a redirect to `/` (already in `src/App.tsx:54`) or remove it entirely to reduce confusion

## Implementation Plan
1. Routing audit and cleanup
   - Verify `/dashboard` route presence in `src/App.tsx` and remove any unused/legacy home routes
   - Delete or merge `src/pages/CustomerDashboardPage.tsx` into `DashboardPage.tsx`
2. Navigation consistency
   - Standardize header/link behaviors: in `NavigationBar`, logo/back redirect to `/` when logged out; redirect to `/dashboard` when logged in
   - Align `AppShell` and `LayoutWrapper` visibility rules so home shows only intended navigation (no secondary bar conflicts)
3. Auth redirects
   - Confirm `login`/`signup` redirects in `src/contexts/AuthContext.tsx:100-108, 137-142, 200-205` send customers to `/dashboard` and owners to `/onboarding`
   - Keep `logout` redirect to `/` (`src/contexts/AuthContext.tsx:221`)
4. Verification
   - Build and test flows: unauthenticated visit `/`, login as customer → `/dashboard`, owner → `/onboarding` then store; logout → `/`
   - Check logo/back from onboarding and store setup behave consistently

## Outcome
- A single, clear public homepage at `/`
- A single, clear signed‑in homepage at `/dashboard`
- No duplicate/competing "home" pages
- Simplified navigation and consistent redirects across the app