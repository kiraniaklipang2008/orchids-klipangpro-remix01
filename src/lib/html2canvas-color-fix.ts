/**
 * html2canvas Color Fix Utility
 * 
 * Fixes "Attempting to parse an unsupported color function 'lab'" error
 * by converting CSS Color Level 4 functions to rgb/rgba
 * 
 * Unsupported by html2canvas:
 * - lab(), lch(), oklab(), oklch(), color()
 * - color-mix(), light-dark()
 */

const UNSUPPORTED_COLOR_REGEX = /\b(lab|lch|oklab|oklch|color|color-mix|light-dark)\s*\(/i;

export function hasUnsupportedColor(value: string | null | undefined): boolean {
  if (!value) return false;
  return UNSUPPORTED_COLOR_REGEX.test(value);
}

export function convertColorToRgba(color: string): string {
  if (!color || color === 'transparent' || color === 'none' || color === 'initial' || color === 'inherit') {
    return color;
  }

  if (!hasUnsupportedColor(color)) {
    return color;
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return 'rgba(0, 0, 0, 0)';
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    
    return a === 255 
      ? `rgb(${r}, ${g}, ${b})` 
      : `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
  } catch {
    return 'rgba(0, 0, 0, 0)';
  }
}

export function convertGradient(gradient: string): string {
  if (!gradient || gradient === 'none') return gradient;
  if (!hasUnsupportedColor(gradient)) return gradient;

  let result = gradient;
  const colorMatches = gradient.match(/(lab|lch|oklab|oklch|color|color-mix|light-dark)\([^)]*(?:\([^)]*\)[^)]*)*\)/gi);
  
  if (colorMatches) {
    colorMatches.forEach(match => {
      const converted = convertColorToRgba(match);
      result = result.replace(match, converted);
    });
  }
  
  return result;
}

export function convertBoxShadow(boxShadow: string): string {
  if (!boxShadow || boxShadow === 'none') return boxShadow;
  if (!hasUnsupportedColor(boxShadow)) return boxShadow;

  return boxShadow.replace(
    /(lab|lch|oklab|oklch|color|color-mix|light-dark)\([^)]*(?:\([^)]*\)[^)]*)*\)/gi,
    (match) => convertColorToRgba(match)
  );
}

const COLOR_PROPERTIES = [
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'outlineColor',
  'textDecorationColor',
  'caretColor',
  'fill',
  'stroke',
  'stopColor',
  'floodColor',
  'lightingColor',
] as const;

const GRADIENT_PROPERTIES = [
  'backgroundImage',
  'background',
  'maskImage',
  'listStyleImage',
] as const;

const SHADOW_PROPERTIES = [
  'boxShadow',
  'textShadow',
  'filter',
] as const;

export function fixElementColors(element: HTMLElement): void {
  const computedStyle = window.getComputedStyle(element);

  for (const prop of COLOR_PROPERTIES) {
    const value = computedStyle.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
    if (value && hasUnsupportedColor(value)) {
      element.style[prop as keyof CSSStyleDeclaration] = convertColorToRgba(value) as string;
    }
  }

  for (const prop of GRADIENT_PROPERTIES) {
    const value = computedStyle.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
    if (value && hasUnsupportedColor(value)) {
      element.style[prop as keyof CSSStyleDeclaration] = convertGradient(value) as string;
    }
  }

  for (const prop of SHADOW_PROPERTIES) {
    const value = computedStyle.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
    if (value && hasUnsupportedColor(value)) {
      if (prop === 'boxShadow' || prop === 'textShadow') {
        element.style[prop as keyof CSSStyleDeclaration] = convertBoxShadow(value) as string;
      }
    }
  }
}

export function fixAllElementColors(root: HTMLElement): void {
  fixElementColors(root);
  
  const allElements = root.querySelectorAll('*');
  allElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      fixElementColors(el);
    }
  });
}

interface Html2CanvasOptions {
  scale?: number;
  useCORS?: boolean;
  allowTaint?: boolean;
  backgroundColor?: string;
  logging?: boolean;
  imageTimeout?: number;
  removeContainer?: boolean;
  windowWidth?: number;
  windowHeight?: number;
  onclone?: (clonedDoc: Document, clonedElement: HTMLElement) => void;
}

export function getHtml2CanvasOptions(
  customOptions: Html2CanvasOptions = {}
): Html2CanvasOptions {
  const userOnclone = customOptions.onclone;

  return {
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    imageTimeout: 15000,
    ...customOptions,
    onclone: (clonedDoc: Document, clonedElement: HTMLElement) => {
      fixAllElementColors(clonedElement);
      
      if (userOnclone) {
        userOnclone(clonedDoc, clonedElement);
      }
    },
  };
}

export default {
  convertColorToRgba,
  convertGradient,
  convertBoxShadow,
  fixElementColors,
  fixAllElementColors,
  getHtml2CanvasOptions,
  hasUnsupportedColor,
};
