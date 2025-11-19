## Goals
- Remove the animation from the sign-in/sign-up page and show the form immediately
- Add a visible “Try Demo” button to enter a demo view without real signup/login
- Fix UI clustering/overlay and ensure no navigation bars appear on auth screens

## Changes
### 1) Remove Animation
- `src/pages/AuthPage.tsx`: delete LogoAnimation import and usage; render `<AuthForm />` directly without `AnimatePresence`. Use the existing `auth-page` container for a clean, professional layout.

### 2) Add Demo Button (Demo View)
- `src/contexts/AuthContext.tsx`: add `loginDemo()` that sets a mock user and token in state/localStorage and navigates to `/dashboard`.
- `src/components/auth/AuthForm.tsx`: add a secondary button “Try Demo” near the Google sign-in that calls `loginDemo()`; keep styles consistent with the design system (same button radius and spacing).

### 3) Fix Clustering/Overlay
- `src/components/layout/AppShell.tsx`: change `isAuthPage` to `location.pathname.startsWith('/auth')` so top/bottom navigation never show on any auth route variant; prevents UI overlay.
- Verify CSS z-index/spacing: keep existing BEM classes; no additional tokens required.

### 4) Verification
- Run the dev server, open `/auth`:
  - Auth form appears immediately, no animation.
  - Demo button logs a demo user and navigates to dashboard.
  - No header/bottom nav on auth page.
- Post-login pages display properly (Dashboard, Orders). Orders shows empty state if no store.

### Files Updated
- `src/pages/AuthPage.tsx`
- `src/contexts/AuthContext.tsx`
- `src/components/auth/AuthForm.tsx`
- `src/components/layout/AppShell.tsx`

If approved, I’ll implement these changes, run the preview, and verify end-to-end.