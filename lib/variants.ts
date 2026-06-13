import { ProductVariant } from "./sheets";

export function getAvailableSizes(variants: ProductVariant[]): string[] {
  const sizes = variants.map(v => v.size).filter(Boolean) as string[];
  return Array.from(new Set(sizes));
}

export function getAvailableColors(variants: ProductVariant[]): string[] {
  const colors = variants.map(v => v.color).filter(Boolean) as string[];
  return Array.from(new Set(colors));
}

export function findMatchingVariant(
  variants: ProductVariant[], 
  size?: string, 
  color?: string
): ProductVariant | undefined {
  if (!variants || variants.length === 0) return undefined;
  
  return variants.find(v => {
    const sizeMatch = size ? v.size === size : true;
    const colorMatch = color ? v.color === color : true;
    return sizeMatch && colorMatch;
  });
}
