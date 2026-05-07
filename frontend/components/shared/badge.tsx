"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  count: number;
  className?: string;
}

export default function Badge({ count, className }: BadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      key={count}
      className={cn(
        "absolute -right-2 -top-2 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-cinnamon text-sm font-bold text-white shadow-md animate-in fade-in zoom-in duration-300",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
