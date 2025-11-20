## Scope
- Update all copyright notices from 2024 → 2025
- Fix placeholder–icon overlap/misalignment across the entire onboarding flow (Business Information, Contact Details, Store Setup)

## Research Summary
- Copyright:
  - `src/pages/HomePage.tsx:958` already shows `© 2025 RIBA. All rights reserved.`
  - `src/pages/AuthPage.tsx:86` shows `© 2024 RIBA Marketplace. All rights reserved.` (needs update)
- Onboarding inputs use `.input` plus Tailwind classes; `.input` in `src/index.css:1709–1727` sets generic padding (`padding: 10px 12px`), which can override Tailwind `pl-10` and cause icon overlap.
- Iconed inputs in `src/pages/OnboardingPage.tsx` include Business Name, Phone, Website, Store Name with absolute icons at `top-3.5`, potentially misaligned.

## Implementation Plan
### 1) Copyright Updates
- Replace `© 2024` → `© 2025` in `src/pages/AuthPage.tsx:86`
- Re-scan for other copyright notices and update any remaining instances (none found beyond the two locations above).

### 2) Onboarding Placeholder–Icon Alignment
- Add a dedicated utility class to `src/index.css`:
  - `.input--with-icon { padding-left: 2.75rem; }` placed after `.input` block to ensure it overrides base padding
  - Optional: `.input--with-icon:focus { padding-left: 2.75rem; }` to prevent focus style from resetting padding
- Update icon positioning to vertically center:
  - Use `className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"`
- Apply `.input--with-icon` to all onboarding fields with icons:
  - Business Name, Phone Number, Website, Store Name inputs (`src/pages/OnboardingPage.tsx`)
- Ensure consistent placeholder styling and width:
  - Keep `w-full`, `placeholder-gray-500`
- Validate composite fields:
  - Store URL prefix (`riba.store/`) retains spacing with `rounded-l-none` and input remains `w-full` without icon, so no extra class needed

### 3) Verification
- Build and run
- Manual QA across all onboarding steps:
  - Type into each field; verify placeholder text never overlaps icons
  - Check focus/validation states (error borders) keep alignment
- Re-run repository-wide search for `© 2024` to confirm no remaining notices

## Outcome
- All copyright notices reflect 2025
- Onboarding inputs have consistent spacing; icons and placeholders are properly aligned across all sections
- No clustering or overlap during typing, focus, or validation states