import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats an ISO date string to HH:mm format.
 * Example: 2024-04-12T18:25:30Z -> 18:25
 */
export function formatEntryTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Calculates remaining time in minutes.
 * (entryTime + timeLimit - currentTime)
 */
export function calculateRemainingTime(
  entryTime: string,
  timeLimitMinutes: number = 90,
): number {
  const entryDate = new Date(entryTime);
  const limitDate = new Date(entryDate.getTime() + timeLimitMinutes * 60000);
  const currentDate = new Date();
  const diffMs = limitDate.getTime() - currentDate.getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
}
