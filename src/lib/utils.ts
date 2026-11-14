import { clsx, type ClassValue } from "clsx";

/** Joins class names, skipping falsy ones: cn(styles.card, active && styles.active). */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
