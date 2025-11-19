## Visual System
- Material Design‑inspired system using an 8px grid; tokens for spacing (8/16/24/40), radii (4/8/12), shadows (dp levels), and brand colors (Primary: #0B6E4F, Secondary: #0ea371, Neutrals).
- Typography hierarchy: H1 (40/1.2), H2 (32/1.25), H3 (24/1.3), H4 (20), body (16/1.6), caption (12); consistent letter spacing and AA contrast.
- Breakpoints: mobile ≥320px, tablet ≥768px, desktop ≥1024px; grid changes at each.

## Navigation
- Persistent marketing header (fixed on scroll) with:
  - Left brand logo (min 48px height, padded) and centered option on small screens.
  - Primary CTA: “Dashboard” (min 40px height, strong contrast) visible to authenticated users; otherwise “Sign Up”.
  - Global navigation with mega menu (Features, Pricing, Resources) on desktop; collapsible hamburger for mobile with smooth transitions.
- Keyboard navigable, ARIA roles for menu, focus trapping for mobile menu.

## Content Architecture
- Hero
  - H1 value prop (≤8 words) and H2 support (≤15 words).
  - Primary CTA + Secondary CTA; micro‑interactions (fade/slide).
  - Feature bullets (3–5) highlighting benefits.
- Product Showcase
  - Interactive feature cards (hover/ripple), advantage‑focused copy, inline SVG illustrations.
- Social Proof
  - Client logos carousel, testimonial slider, trust badges (SSL/Payment), accessible controls.

## User Flow
- Pre‑login
  - Subtle micro‑interactions and progressive disclosure (e.g., “More benefits” expandable).
  - Clear signup incentives near CTAs.
- Post‑signup onboarding (UI scaffolding only, no logic changes)
  - 3–5 step wizard: business profile → menu/cart setup → publishing.
  - Forms with real‑time validation hooks, dropdown for business type, basic info.
  - Setup scaffolds (drag‑and‑drop placeholder, category management, media upload UI).
  - Publishing tools preview: QR code placeholder, flyer templates, short link tile.

## Product Management (Scaffold Only)
- Owner portal shells:
  - Upload workflow (CSV import button, single product form fields, gallery slots, variant options UI).
  - Customer display: responsive product grids, filter/sort UI, product detail shell (zoomable images, add‑to‑cart button, related products).

## Technical Implementation
- Performance: lazy‑load hero images (WebP when available), code splitting for heavy sections (carousels/sliders), defer non‑critical JS; asset hints (decoding="async").
- Accessibility: ARIA labels for menus/sliders/buttons, keyboard navigation, focus rings, ≥4.5:1 contrast.
- Analytics: event tracking hooks on CTAs (click, view), funnel steps (hero → signup), heatmap integration stub.

## QA Protocol
- Cross‑browser smoke (Chrome/Firefox/Edge/Safari) and cross‑device responsiveness.
- Validation: form error states, empty states, network fail placeholders.
- Visual QA: pixel‑tight spacing, animation perf (reduced motion), dark‑mode compatibility token plan.

## Implementation Plan (UI‑Only)
- Components:
  - `MarketingHeader` with Logo, CTA, MegaMenu, MobileMenu.
  - `Hero` (H1/H2, bullets, CTAs, decorative SVG).
  - `FeatureCards` (SVG illustrations, hover states).
  - `SocialProof` (LogosCarousel, TestimonialSlider, TrustBadges).
  - `OnboardingWizard` scaffolding (3–5 steps, UI only).
- Files to update/create:
  - Update `src/pages/HomePage.tsx` to compose header + hero + sections.
  - Add new components under `src/components/marketing/*`.
  - Extend `src/index.css` with Material grid tokens, header/mega menu, hero, cards, sliders; keep BEM classes and AA contrast.
  - Keep `/auth` pages as is (already redesigned) and ensure isolation.

## Deliverables
- Complete responsive homepage with header/mega menu, hero, feature cards, social proof.
- Auth pages remain centered and consistent.
- Style guide (tokens, components) and QA notes.
- Analytics hooks ready.

On approval, I will implement the homepage and related components, update CSS tokens, wire accessibility/analytics stubs, run the preview, and verify across breakpoints.