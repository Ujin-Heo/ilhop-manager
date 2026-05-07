"use client";

import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProp {
  quantity: number;
  minQuantity: number;
  setQuantity: (newQuantity: number | ((prev: number) => number)) => void;
  className?: string;
}

export default function QuantitySelector({
  quantity,
  minQuantity,
  setQuantity,
  className,
}: QuantitySelectorProp) {
  const incrementQuantity = () => setQuantity((prev) => prev + 1);

  const decrementQuantity = () =>
    setQuantity((prev) => (prev > minQuantity ? prev - 1 : minQuantity));

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-sepia/20 p-1",
        className,
      )}
    >
      <button
        onClick={decrementQuantity}
        className="flex h-8 w-8 items-center justify-center rounded-full text-sepia"
        aria-label="Decrease quantity"
      >
        <Minus size={18} />
      </button>
      <span className="w-8 text-center text-base font-bold text-deep-brown">
        {quantity}
      </span>
      <button
        onClick={incrementQuantity}
        className="flex h-8 w-8 items-center justify-center rounded-full text-sepia"
        aria-label="Increase quantity"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
