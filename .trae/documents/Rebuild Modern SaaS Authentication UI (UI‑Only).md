## Objectives
- Replace current sign-in/sign-up UI with a fresh, clean, conversion-focused SaaS design
- Keep all authentication logic unchanged (forms, handlers, validation)
- Deliver fully responsive UI with consistent spacing, typography, and visual hierarchy

## Core Principles
- Minimal, distraction-free layout: only the auth card, no global navs or footers
- Strong header hierarchy (logo, title, subtitle) → form → actions → mode toggle
- Clear labels above inputs, subtle placeholders, accessible focus states
- Button hierarchy: Primary (green), Secondary (Google), Tertiary (Demo) with low emphasis

## Implementation Plan (UI‑Only)
### Layout Isolation
- Confirm `/auth` route uses an isolated layout (no TopBar/MobileBottomNav); retain this behavior
- Remove residual animation or overlays; render the form immediately

### Component Structure
- `src/pages/AuthPage.tsx`: Thin container → centers the card on page; renders `<AuthForm />` only
- `src/components/auth/AuthForm.tsx` (UI refactor only):
  1. Header: small logo, “Welcome Back”, subtitle “Sign in to manage your store”
  2. Actions: secondary Google button (border-only, left icon); tertiary demo button (text/dashed)
  3. Divider: thin line with “or continue with email”
  4. Form: labels above inputs, aligned icons, show/hide password; spacing 12/16/24/40 px grid
  5. Mode toggle: minimal link to switch sign-in/sign-up

### Design Tokens & Styles
- Add/refine CSS variables for card, inputs, and spacing:
  - Card: max-width 420px; radius 12px; padding 32px vertical, 28px horizontal; soft shadow `0 8px 24px rgb(16 24 40 / 0.08)`
  - Inputs: height 48px; border `1px #E5E7EB`; focus `1.5px` brand green ring via box-shadow; radius 8px; padding 12–14px; placeholder `#9CA3AF`
  - Spacing rhythm: 40px header→form, 24px sections, 16px between inputs, 12px label→input
  - Buttons: primary solid green; secondary bordered; tertiary text/dashed border
  - Divider: thin `#E5E7EB` line; small neutral text

### Responsiveness
- Desktop: vertically centered card with balanced negative space
- Mobile: centered with top spacing (not full-height); touch-friendly targets

### Accessibility & Semantics
- Use `label` + `for` attributes; ARIA labels for toggle-password
- High-contrast focus states; proper tab order

### Demo View UI (Optional, UI‑Only)
- Tertiary demo button uses Hausa names (e.g., “Amina Bello”) without altering auth logic
- Dashboard shows a subtle “Demo Mode” badge and Hausa sample names (UI-only)

### Files to Update
- `src/pages/AuthPage.tsx` (layout isolation)
- `src/components/auth/AuthForm.tsx` (JSX structure and classes; no logic changes)
- `src/index.css` (auth BEM block: card, inputs, buttons, divider, spacing)
- `src/pages/DashboardPage.tsx` (tiny demo badge and Hausa names UI-only)

### Deliverables
- Production-grade TSX for the rebuilt auth screen
- Updated CSS tokens and BEM classes meeting SaaS design specs
- Fully responsive, accessible, and visually consistent UI

### Validation
- Run dev server and verify `/auth` on mobile/desktop
- Confirm isolation (no nav/footer), spacing, focus states, and button hierarchy
- Check demo button visual priority and dashboard demo badge visibility

On approval, I will implement the refactor in the listed files, run a preview, and validate end-to-end.