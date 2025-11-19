/**
 * Accessibility Testing Utilities for WCAG 2.1 AA Compliance
 */

export interface AccessibilityTest {
  name: string;
  test: () => boolean | Promise<boolean>;
  description: string;
}

export const accessibilityTests: AccessibilityTest[] = [
  {
    name: 'Color Contrast',
    test: () => {
      // Test for minimum 4.5:1 contrast ratio
      const elements = document.querySelectorAll('button, input, a, [role="button"]');
      return Array.from(elements).every(el => {
        const style = window.getComputedStyle(el);
        const bgColor = style.backgroundColor;
        const textColor = style.color;
        return hasSufficientContrast(bgColor, textColor, 4.5);
      });
    },
    description: 'Ensures text has sufficient contrast against background (4.5:1 ratio)'
  },
  {
    name: 'Focus Indicators',
    test: () => {
      const focusableElements = document.querySelectorAll('button, input, a, [tabindex="0"]');
      return Array.from(focusableElements).every(el => {
        const style = window.getComputedStyle(el, ':focus');
        return style.outline !== 'none' || style.border !== 'none';
      });
    },
    description: 'Ensures all focusable elements have visible focus indicators'
  },
  {
    name: 'ARIA Labels',
    test: () => {
      const interactiveElements = document.querySelectorAll('button, input, a[role="button"]');
      return Array.from(interactiveElements).every(el => {
        return el.hasAttribute('aria-label') || 
               el.hasAttribute('aria-labelledby') || 
               el.textContent?.trim() !== '';
      });
    },
    description: 'Ensures interactive elements have proper ARIA labels'
  },
  {
    name: 'Form Labels',
    test: () => {
      const inputs = document.querySelectorAll('input:not([type="hidden"])');
      return Array.from(inputs).every(input => {
        const id = input.getAttribute('id');
        const hasLabel = document.querySelector(`label[for="${id}"]`) || 
                         input.closest('label') || 
                         input.hasAttribute('aria-label') ||
                         input.hasAttribute('aria-labelledby');
        return !!hasLabel;
      });
    },
    description: 'Ensures all form inputs have associated labels'
  },
  {
    name: 'Keyboard Navigation',
    test: () => {
      const focusableElements = document.querySelectorAll('button, input, a, [tabindex="0"]');
      return focusableElements.length > 0 && 
             Array.from(focusableElements).every(el => !el.hasAttribute('tabindex') || el.getAttribute('tabindex') !== '-1');
    },
    description: 'Ensures all interactive elements are keyboard accessible'
  },
  {
    name: 'Skip Links',
    test: () => {
      const skipLinks = document.querySelectorAll('a[href^="#"]');
      return Array.from(skipLinks).some(link => 
        link.textContent?.toLowerCase().includes('skip') ||
        link.textContent?.toLowerCase().includes('jump')
      );
    },
    description: 'Ensures skip navigation links are available'
  },
  {
    name: 'Error Messages',
    test: () => {
      const errorElements = document.querySelectorAll('[role="alert"], .error, [aria-live]');
      return Array.from(errorElements).every(el => {
        return el.hasAttribute('aria-live') || 
               el.hasAttribute('role') ||
               el.getAttribute('aria-atomic') === 'true';
      });
    },
    description: 'Ensures error messages are announced to screen readers'
  },
  {
    name: 'Touch Targets',
    test: () => {
      const touchTargets = document.querySelectorAll('button, a, input, [role="button"]');
      return Array.from(touchTargets).every(el => {
        const rect = el.getBoundingClientRect();
        return rect.width >= 44 && rect.height >= 44;
      });
    },
    description: 'Ensures touch targets are at least 44x44 pixels (mobile accessibility)'
  }
];

/**
 * Check if two colors have sufficient contrast ratio
 */
function hasSufficientContrast(bgColor: string, textColor: string, requiredRatio: number): boolean {
  // Simplified contrast check - in real implementation, use proper color contrast algorithms
  // This is a basic check for demonstration purposes
  if (bgColor === 'transparent' || textColor === 'transparent') return true;
  
  // Extract RGB values (simplified)
  const bgRgb = extractRGB(bgColor);
  const textRgb = extractRGB(textColor);
  
  if (!bgRgb || !textRgb) return true; // Skip if can't parse colors
  
  const ratio = calculateContrastRatio(bgRgb, textRgb);
  return ratio >= requiredRatio;
}

/**
 * Extract RGB values from color string
 */
function extractRGB(color: string): { r: number; g: number; b: number } | null {
  // Handle rgb() format
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3])
    };
  }
  
  // Handle rgba() format (ignore alpha)
  const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1]),
      g: parseInt(rgbaMatch[2]),
      b: parseInt(rgbaMatch[3])
    };
  }
  
  return null;
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }): number {
  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance
 */
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  const rs = r / 255;
  const gs = g / 255;
  const bs = b / 255;
  
  const rLinear = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
  const gLinear = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
  const bLinear = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Run all accessibility tests and return results
 */
export async function runAccessibilityTests(): Promise<{
  passed: number;
  failed: number;
  results: Array<{ name: string; passed: boolean; description: string; error?: string }>
}> {
  const results = [];
  let passed = 0;
  let failed = 0;
  
  for (const test of accessibilityTests) {
    try {
      const result = await test.test();
      results.push({
        name: test.name,
        passed: result,
        description: test.description
      });
      
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      results.push({
        name: test.name,
        passed: false,
        description: test.description,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      failed++;
    }
  }
  
  return { passed, failed, results };
}

/**
 * Create accessibility report
 */
export function createAccessibilityReport(results: {
  passed: number;
  failed: number;
  results: Array<{ name: string; passed: boolean; description: string; error?: string }>
}): string {
  const total = results.passed + results.failed;
  const score = Math.round((results.passed / total) * 100);
  
  let report = `Accessibility Test Report\n`;
  report += `========================\n\n`;
  report += `Overall Score: ${score}% (${results.passed}/${total} tests passed)\n\n`;
  
  report += `Test Results:\n`;
  results.results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    report += `${status} ${result.name}: ${result.description}\n`;
    if (result.error) {
      report += `   Error: ${result.error}\n`;
    }
  });
  
  return report;
}