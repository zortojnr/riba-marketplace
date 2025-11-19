## Scope
- Build a Material-inspired SaaS homepage using an 8px grid, strong typography hierarchy, brand-aligned colors, and full responsiveness (≥320px, ≥768px, ≥1024px).

## Navigation System
- Fixed marketing header with:
  - Left logo (≥48px height) and padded alignment.
  - Primary CTA (Dashboard/Sign Up) 40px min height, strong contrast.
  - Desktop mega menu: Features, Pricing, Resources (hover/focus accessible panes).
  - Mobile hamburger: slide-in panel, focus trap, ESC close.

## Content Architecture
- Hero:
  - H1 ≤8 words, H2 ≤15 words.
  - Primary and secondary CTAs.
  - 3–5 feature bullets.
  - Subtle micro-interactions (fade/slide) and decorative SVG.
- Product Showcase:
  - Interactive feature cards with hover states and advantage-focused copy.
  - Inline SVG illustrations (lightweight, accessible).
- Social Proof:
  - Client logos carousel (autoplay with pause on hover/focus).
  - Testimonial slider (keyboard navigable).
  - Trust badges (SSL, payments) with alt text.

## User Flow (UI Scaffolding Only)
- Pre-login: progressive disclosure blocks and signup incentive strip.
- Post-signup onboarding scaffold: 3–5 step wizard shells (business profile → menu/cart setup → publishing tools). No logic changes.

## Technical Implementation
- Components (UI only):
  - `src/components/marketing/Header.tsx` (logo, CTA, mega menu, mobile menu).
  - `src/components/marketing/Hero.tsx` (headlines, bullets, CTAs, SVG decor).
  - `src/components/marketing/FeatureCards.tsx`.
  - `src/components/marketing/SocialProof.tsx` (LogosCarousel, TestimonialSlider, TrustBadges).
  - `src/components/marketing/OnboardingWizard.tsx` (scaffold).
- Page composition: update `src/pages/HomePage.tsx` to import and render these sections.
- Styles: extend `src/index.css` with BEM blocks for header/mega menu, hero, cards, sliders; maintain AA contrast and 8px grid spacing.
- Performance: lazy-load images (WebP preferred), `decoding="async"`, code-split sliders/carousels.
- Accessibility: ARIA roles (menu, button, slider), keyboard navigation, focus-visible rings, ≥4.5:1 contrast.
- Analytics: stub event handlers for CTA clicks and hero views.

## QA & Validation
- Responsive pass across breakpoints.
- Cross-browser smoke (Chrome/Firefox/Edge/Safari).
- Keyboard navigation, screen reader labels.
- Visual QA: spacing consistency, animation perf; reduced-motion fallback.

## Deliverables
- Complete homepage sections and header.
- Updated CSS tokens and BEM classes.
- Accessibility and analytics hooks.
- Short style guide and testing notes.

Confirm to proceed; I will implement components, styles, compose the page, and run a preview for verification.