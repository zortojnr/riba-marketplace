## Goals
- Make sign-in/sign-up look professional after the logo animation
- Ensure post-login pages render reliably (fix fetch so the UI shows)
- Eliminate clustering/overlaying issues across the auth and post-login UI

## Problems Observed
- Auth animation uses a full-screen fixed overlay; if exit timing or layering is off, the form can appear underneath temporarily (`src/components/auth/LogoAnimation.tsx:57`).
- Orders page keeps `loading` true when no store is selected, so UI never appears (`src/pages/OrdersPage.tsx:13, 17–35`).
- Minor spacing/z-index inconsistencies between auth and post-login layouts.

## Implementation Plan
### 1) Auth UI Polish (Professional Look)
- Refine card container sizing and spacing; enforce consistent max-width and vertical rhythm in `index.css` BEM blocks.
- Improve visual hierarchy: title/subtitle weights, divider spacing, and button elevation in `.auth__card`, `.auth__header`, `.auth__social`, `.auth__form`.
- Tighten icon alignment and text spacing using existing BEM classes (`.auth__icon`, `.auth__label`, `.auth__input-group`).

### 2) Animation Overlay Reliability
- Ensure the animation overlay fully unmounts before showing the form:
  - Confirm `setIsAnimating(false)` occurs before `onAnimationComplete` (already present at `LogoAnimation.tsx:30–35`).
  - Add a small safety: set `pointer-events: none` on the overlay root during exit and validate z-index of the form container.
  - Verify `AnimatePresence` transitions in `AuthPage.tsx:31–44` (auth form wrapper) do not overlap with the animation exit.

### 3) Post‑Login Fetch Fix
- OrdersPage: prevent infinite loading when `currentStore` is absent.
  - If `currentStore?.id` is missing, immediately set `loading` to false and render a friendly empty state with guidance to complete onboarding or select a store (`src/pages/OrdersPage.tsx:17–35`).
- Add defensive UI in OrdersPage:
  - Show “No store selected” message and link to onboarding or settings when `currentStore` is null.
- Dashboard: keep static demo data but ensure layout matches the design system so the page always looks professional post-login (`src/pages/DashboardPage.tsx`).

### 4) Clustering/Overlaying Fixes
- Standardize stacking context and spacing:
  - Define z-index tokens for animation, top bar, modals, and page content, and apply consistently in CSS.
  - Ensure `AppShell` padding (`pt-16`) avoids header overlap (`src/components/layout/AppShell.tsx:27`).

### 5) QA & Verification
- Run the dev server and visually inspect:
  - Auth: spacing, focus states, contrast, icon alignment.
  - Transition from animation → form (no overlay/pointer block).
  - Post-login: Dashboard and Orders render; Orders shows friendly state when no store.
- Accessibility pass: focus order, labels, contrast.
- Cross-browser quick check (Chrome/Firefox).

### 6) Files to Update
- `src/pages/OrdersPage.tsx`: adjust loading logic, add “no store selected” empty state.
- `src/components/auth/LogoAnimation.tsx`: add `pointer-events: none` on overlay during exit if needed.
- `src/pages/AuthPage.tsx` and `src/index.css`: small spacing/z-index refinements to polish the look.

### 7) Deliverables
- Professional auth UI after animation
- Reliable post-login rendering (no stuck loading)
- Clean, non-overlapping UI layers across pages
- Verified in preview and accessible.

Please confirm, and I’ll implement these changes immediately, run the preview, and validate end-to-end.