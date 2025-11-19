## Overview
Deliver a professional SaaS landing page and refined auth pages with clean, conversion‑focused UI, consistent typography, spacing, and accessibility. Keep authentication logic intact.

## Routing & Layout Isolation
- Switch the root route `/` to render the new `HomePage` (marketing landing).
- Keep `/auth` for Sign In / Sign Up in an isolated layout (no navbar/footer/cart/bottom nav).
- Keep existing auth logic; only update JSX/CSS.

## Header (Landing Only)
- Build a lightweight marketing header (inside HomePage, not TopBar) with:
  - Left: brand logo `assets/images/logo.png` sized 32–40px, padded.
  - Right: `Login` (outline) and `Sign Up` (primary) buttons with 44px minimum tap targets.
  - Simple, sticky top for desktop; collapsible spacing for mobile.
- Hover/active/focus states; accessible roles/labels.

## Hero Section
- Modern SaaS hero:
  - H1 headline with value proposition
  - H2 subheadline with benefits
  - Primary CTA (contrasting brand green)
  - Brand logo used as visual accent; subtle decorative elements (icons/soft shapes)
  - Soft shadows and micro‑animations (fade/slide)
- Responsive:
  - Desktop: two‑column feel (content + visual)
  - Mobile: stacked, centered, generous top spacing

## Style Guidelines
- Typography: Inter (already loaded); consistent scale, relaxed line height, letter spacing tuned for readability.
- Colors: limited palette using brand green, neutrals; maintain AA contrast.
- Spacing: vertical rhythm (40px section, 24px blocks, 16px inputs), consistent paddings.

## Auth Pages (UI‑Only)
- Centered card (max‑width 420px, radius 12px, padding 32/28, soft shadow).
- Logo prominent at top, clean titles/subtitles.
- Inputs: labels above fields, placeholder `#9CA3AF`, 48px height, `#E5E7EB` borders, 1.5px brand‑green focus ring, show/hide password.
- Actions: primary CTA (full width), secondary Google (border only, left icon), tertiary demo (low emphasis), loading states.
- Background: subtle gradient, non‑distracting.
- Demo view keeps Hausa names for demo user and dashboard sample data.

## Accessibility & Performance
- WCAG 2.1 AA: focus indicators, contrast, semantic labels, keyboard navigation.
- Performance: use `assets/images/logo.png` as optimized PNG (or WebP if available); defer heavy animations; compress additional hero assets if added.

## Files to Update
- `src/App.tsx`: set `/` → `HomePage`, keep `/auth` for auth.
- `src/pages/HomePage.tsx`: rebuild header + hero per spec.
- `src/components/layout/AppShell.tsx`: ensure no nav on `/auth`; allow marketing header inside HomePage only.
- `src/components/auth/AuthForm.tsx`: ensure UI matches specs (labels, spacing, buttons hierarchy; no logic changes).
- `src/index.css`: add marketing header & hero CSS (BEM): `.marketing-header`, `.hero`, `.hero__title`, `.hero__subtitle`, `.hero__cta`, states.

## Deliverables
- Complete redesigned homepage (desktop/mobile)
- Responsive login/signup pages
- Brief style guide (tokens, components, spacing, color usage)
- Asset optimization notes (logo sizing, format)
- Quick cross‑browser testing notes (Chrome/Firefox/Edge/Safari)

## Validation Plan
- Run dev server, verify `/` landing and `/auth` isolation
- Inspect focus/contrast, responsive breakpoints (sm/md/lg)
- Cross‑browser smoke tests

On approval, I will implement the changes, provide full TSX/CSS, run preview, and deliver the style guide and test notes.