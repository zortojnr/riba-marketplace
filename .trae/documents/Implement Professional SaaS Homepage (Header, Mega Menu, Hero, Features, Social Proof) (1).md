## Visual System
- 8px grid for spacing (8/16/24/40). Radii (4/8/12). Shadows (dp-style soft).
- Typography hierarchy: H1 40/1.2, H2 32/1.25, H3 24/1.3, H4 20, Body 16/1.6, Caption 12.
- Brand colors: Primary #0B6E4F, Secondary #0ea371, Neutrals (#111827/#4B5563/#E5E7EB/#F9FAFB).
- Breakpoints: ≥320px, ≥768px, ≥1024px.

## Navigation (Header)
- Fixed marketing header:
  - Left logo (≥48px height) padded; centered on very small screens.
  - Right CTAs: Dashboard (auth) / Sign Up (guest), min height 40px.
  - Desktop mega menu: Features, Pricing, Resources — accessible hover/focus panes.
  - Mobile hamburger: slide-in, focus trap, ESC to close.

## Content Architecture
- Hero
  - H1 ≤8 words; H2 ≤15 words.
  - Primary CTA (contrast), Secondary CTA.
  - 3–5 benefit bullets with icons.
  - Subtle micro-interactions (fade/slide); decorative SVG.
- Product Showcase
  - 3–6 feature cards with hover states; inline SVG illustrations; advantage-focused copy.
- Social Proof
  - Client logos carousel (autoplay/pause on hover/focus).
  - Testimonial slider (keyboard accessible).
  - Trust badges with alt text.

## Accessibility & Performance
- ARIA roles (menu, button, slider), keyboard navigation, focus-visible rings.
- ≥4.5:1 contrast; reduced-motion support.
- Lazy-loaded images (`loading="lazy"`, `decoding="async"`), WebP when available.
- Code splitting for carousels/sliders.

## Analytics
- Click/view event hooks for CTAs and major sections; funnel step stubs (hero→signup).

## Components & Files
- Add:
  - `src/components/marketing/Header.tsx`
  - `src/components/marketing/Hero.tsx`
  - `src/components/marketing/FeatureCards.tsx`
  - `src/components/marketing/SocialProof.tsx`
  - `src/components/marketing/MegaMenu.tsx`
- Compose in `src/pages/HomePage.tsx`.
- Extend `src/index.css` with BEM blocks: `.marketing-header*`, `.mega-menu*`, `.hero*`, `.feature-card*`, `.social-proof*`.

## QA
- Responsive checks across 320/768/1024+.
- Cross-browser smoke: Chrome/Firefox/Edge/Safari.
- Keyboard navigation and screen reader labels.
- Visual QA: spacing rhythm, hierarchy, animation perf.

## Deliverables
- Fully implemented homepage (header, hero, features, social proof) meeting specs.
- Accessibility and analytics stubs.
- Updated style guide and QA notes.

Confirm and I will implement these components, styles, compose the page, run preview, and verify end-to-end.