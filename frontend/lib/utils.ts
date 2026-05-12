import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses a date string from the DB (YYYY-MM-DD HH:mm:ss).
 * If the string doesn't contain timezone info, it's treated as Local Time.
 */
export function parseDBDate(dateString: string): Date {
  if (!dateString) return new Date();

  // Replace space with T for ISO compliance
  const normalized = dateString.replace(" ", "T");

  // If it already has Z or a +/- offset, new Date() will handle it as UTC/Offset
  // Otherwise, new Date("YYYY-MM-DDTHH:mm:ss") treats it as LOCAL time in most browsers
  return new Date(normalized);
}

/**
 * Formats a date string to HH:mm format (Local Time).
 */
export function formatEntryTime(dateString: string): string {
  const date = parseDBDate(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Calculates remaining time in minutes.
 * (entryTime + timeLimit - currentTime)
 */
export function calculateRemainingTime(
  entryTime: string,
  standardTimeMinutes: number = 90,
  isExtended: boolean = false,
  extraTimeMinutes: number = 60,
): number {
  const entryDate = parseDBDate(entryTime);
  const totalLimit = isExtended ? standardTimeMinutes + extraTimeMinutes : standardTimeMinutes;
  const limitDate = new Date(entryDate.getTime() + totalLimit * 60000);
  const currentDate = new Date();
  const diffMs = limitDate.getTime() - currentDate.getTime();
  return Math.max(-999, Math.floor(diffMs / 60000));
}

/**
 * Formats a date string to HH:mm:ss format (Local Time).
 */
export function formatOrderTime(dateString: string): string {
  const date = parseDBDate(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Formats a number as Korean Won currency.
 * Example: 30000 -> 30,000원
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount) + "원";
}
