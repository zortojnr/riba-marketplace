## Scope
- Pure UI refactor for Sign In / Sign Up to a clean, minimal SaaS design
- No logic changes; only JSX/CSS/Tailwind class updates
- Add non-intrusive demo UI (names in Hausa, demo badge/buttons) without altering auth flow

## Layout Isolation
- Keep `/auth` rendered in a clean layout (no TopBar, Footer, Bottom Nav, Cart, Dashboard menu)
- Confirm `AppShell` already hides nav for `/auth` and retain that behavior

## Auth Card & Spacing
- Max width: 420px; center on page
- Border radius: 12px; soft shadow
- Padding: 32px vertical, 28px horizontal
- Vertical rhythm: 40px header→form, 24px sections, 16px inputs, 12px label→input

## Typography & Inputs
- Labels above inputs (no floating labels); placeholders #9CA3AF
- Inputs 44–48px height; border #E5E7EB; focus 1.5px brand green; radius 8px; padding 12–14px
- Properly aligned password show/hide icon

## Buttons Hierarchy
- Primary: full‑width brand green, medium weight (Sign In/Sign Up)
- Secondary: Google button, border‑only, left icon
- Tertiary: Demo button, simple border or text link; weaker visual weight

## Divider
- Thin line separator with balanced margins: "or continue with email"

## Responsiveness
- Desktop: card vertically centered
- Mobile: card centered with top spacing, not full-height fill

## Demo UI Details (UI‑Only)
- Demo button text and subtle badge use Hausa names (e.g., "Amina Bello", "Usman Abdullahi")
- Dashboard (UI only): show a light "Demo Mode" badge and sample customer names in Hausa; do not change dashboard logic

## Files to Update (UI-Only)
- `src/pages/AuthPage.tsx`: keep simple container; remove any leftover animation references
- `src/components/auth/AuthForm.tsx`: update JSX structure to match specs (labels, inputs, buttons, divider)
- `src/index.css`: refine `.auth` BEM styles (card, inputs, buttons, divider, spacing)
- `src/pages/DashboardPage.tsx`: minor UI-only additions (demo badge, Hausa names in demo cards/text)

## Deliverables
- Production-grade TSX for the auth form and page
- Updated CSS/BEM classes meeting all specifications
- Balanced, professional visual design

## Validation
- Run dev server; verify auth pages show isolated layout and professional styling
- Check focus states, spacing, and button hierarchy
- Confirm mobile/desktop responsiveness

If approved, I will implement the UI-only refactor, provide the full TSX/CSS changes, and run the preview for verification.