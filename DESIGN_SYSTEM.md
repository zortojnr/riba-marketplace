# RIBA Marketplace Design System

## Overview

This document outlines the comprehensive design system implemented for RIBA Marketplace, focusing on the authentication pages and global UI consistency.

## Design Principles

1. **Accessibility First**: WCAG 2.1 AA compliance with proper ARIA labels, keyboard navigation, and screen reader support
2. **Mobile-First**: Responsive design starting from mobile breakpoints
3. **Performance**: Optimized animations and minimal bundle size
4. **Consistency**: Unified design language across all components
5. **Professional**: Clean, modern aesthetic with proper visual hierarchy

## Typography

### Font Families
- Primary: System UI fonts for optimal performance
- Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif

### Font Sizes
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
```

### Font Weights
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Line Heights
```css
--line-height-normal: 1.5;
--line-height-tight: 1.25;
--line-height-relaxed: 1.75;
```

## Spacing System

### Base Spacing Scale
```css
--spacing-1: 0.5rem;    /* 8px */
--spacing-2: 1rem;      /* 16px */
--spacing-3: 1.5rem;    /* 24px */
--spacing-4: 2rem;      /* 32px */
--spacing-5: 2.5rem;    /* 40px */
--spacing-6: 3rem;      /* 48px */
```

### Specific Spacing
- **Vertical spacing**: 16px between major sections
- **Horizontal padding**: 8px for inline elements
- **Icon-text spacing**: 8px between icons and text
- **Form field spacing**: 16px between form groups

## Color Palette

### Primary Colors
- Primary: `#0B6E4F` (Emerald green)
- Primary hover: `#0a5c42`
- Primary light: `#f0fdf4`

### Neutral Colors
- Gray-900: `#111827` (Primary text)
- Gray-700: `#374151` (Secondary text)
- Gray-600: `#4b5563` (Muted text)
- Gray-500: `#6b7280` (Borders)
- Gray-300: `#d1d5db` (Light borders)
- Gray-100: `#f3f4f6` (Backgrounds)

### Semantic Colors
- Success: `#22c55e` / `#16a34a`
- Error: `#ef4444` / `#dc2626`
- Warning: `#f59e0b`
- Info: `#3b82f6`

## Component Architecture

### BEM Naming Convention
All components follow BEM (Block Element Modifier) methodology:
- **Block**: `.auth` (main component)
- **Element**: `.auth__title`, `.auth__input` (child elements)
- **Modifier**: `.auth__input--error`, `.auth__submit--loading` (state variations)

### Authentication Components

#### AuthPage Structure
```
auth-page/
├── auth__container (main wrapper)
├── auth__header (logo and title section)
├── auth__card (form container)
├── auth__social (social login buttons)
├── auth__form (main form)
├── auth__form-group (form field groups)
├── auth__input (form inputs)
├── auth__submit (submit button)
└── auth__toggle (mode switch)
```

#### Form Elements
- **Inputs**: Consistent 48px height, proper padding, focus states
- **Buttons**: Primary CTA with loading states, social buttons with hover effects
- **Error States**: Clear visual feedback with ARIA labels
- **Validation**: Real-time password matching, form validation with Zod

## Responsive Design

### Breakpoints
- Mobile: `< 640px`
- Tablet: `640px - 1024px`
- Desktop: `> 1024px`

### Mobile Optimizations
- Reduced font sizes (14px base)
- Smaller input heights (44px)
- Compact spacing
- Touch-friendly tap targets (minimum 44px)

### Desktop Enhancements
- Larger typography scale
- Enhanced hover states
- Complex animations
- Multi-column layouts

## Accessibility Features

### WCAG 2.1 AA Compliance
1. **Color Contrast**: 4.5:1 ratio for normal text, 3:1 for large text
2. **Keyboard Navigation**: Full keyboard accessibility
3. **Screen Reader Support**: Proper ARIA labels and live regions
4. **Focus Indicators**: Visible focus states with 2px outline
5. **Error Handling**: Clear error messages with ARIA alerts

### ARIA Implementation
- `aria-label`: For buttons and interactive elements
- `aria-describedby`: For form validation errors
- `aria-invalid`: For invalid form fields
- `aria-live`: For dynamic error messages
- `aria-busy`: For loading states

### High Contrast Mode
- Enhanced borders (2px width)
- Stronger focus indicators
- Bold error messages
- Reduced motion support

## Animation System

### Transition Timing
```css
--transition-fast: 150ms ease-in-out;
--transition-normal: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;
```

### Animation Principles
1. **Purposeful**: Animations serve user experience
2. **Performant**: CSS-based animations only
3. **Accessible**: Respects `prefers-reduced-motion`
4. **Consistent**: Unified timing and easing

### Key Animations
- Form transitions: Slide in/out with opacity
- Error messages: Fade in with slight vertical movement
- Loading states: Spinner with proper ARIA labels
- Button interactions: Scale and shadow changes

## Form Validation

### Client-Side Validation
- **Email**: Valid email format
- **Password**: Minimum 6 characters
- **Password Confirmation**: Real-time matching
- **Name**: Minimum 2 characters

### Error Messages
- Clear and specific
- Positioned below fields
- Announced to screen readers
- Consistent styling

### Success States
- Green validation icons
- Success message for password matching
- Visual feedback for valid inputs

## Performance Optimizations

### CSS Optimizations
- CSS custom properties for theming
- Efficient selectors with BEM
- Minimal specificity
- Mobile-first approach

### Bundle Optimizations
- Tree-shakeable imports
- Component code splitting
- Optimized images with proper alt text
- Minimal third-party dependencies

## Cross-Browser Testing

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Testing Requirements
1. **Visual Regression**: Consistent appearance
2. **Functional Testing**: All interactions work
3. **Accessibility Testing**: Screen reader compatibility
4. **Performance Testing**: Fast load times

## Implementation Guidelines

### CSS Architecture
1. **Variables First**: Use CSS custom properties
2. **BEM Consistency**: Follow naming conventions strictly
3. **Mobile-First**: Start with mobile styles
4. **Accessibility**: Include focus and ARIA states

### React Component Patterns
1. **Composition**: Break down complex components
2. **Props Interface**: Clear prop typing
3. **Error Boundaries**: Handle errors gracefully
4. **Performance**: Use React.memo for expensive components

### Testing Strategy
1. **Unit Tests**: Component functionality
2. **Integration Tests**: User workflows
3. **Accessibility Tests**: Automated ARIA validation
4. **Visual Tests**: Screenshot comparisons

## Future Enhancements

### Planned Features
1. **Dark Mode**: Complete dark theme implementation
2. **RTL Support**: Right-to-left language support
3. **Advanced Animations**: Micro-interactions
4. **Design Tokens**: Centralized design system

### Maintenance Guidelines
1. **Regular Audits**: Monthly accessibility reviews
2. **Performance Monitoring**: Track Core Web Vitals
3. **User Feedback**: Collect and implement improvements
4. **Documentation Updates**: Keep this guide current

---

This design system ensures a consistent, accessible, and professional user experience across the RIBA Marketplace platform. All implementations should follow these guidelines to maintain design integrity and user experience quality.