import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes conditionally, resolving conflicting utility classes.
 * Used by every shadcn-vue / UI component for reusable, composable class props.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
