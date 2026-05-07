"use client";

import { useState } from "react";
import { OrderItemSummaryResponse } from "@/lib/definitions";
import { formatCurrency, cn } from "@/lib/utils";
import QuantitySelector from "@/components/customer/quantity-selector";

interface CartItemProps {
  item: OrderItemSummaryResponse;
}

export default function CartItem({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-sepia/10 bg-white/80 px-4 py-3 shadow-md">
      <div className="flex">
        {/* 1. Menu Name (selectedOption) */}
        <h3 className="text-sm font-bold text-deep-brown leading-tight">
          {`${item.menuName}` + " "}
          {item.selectedOption && (
            <span className="text-xs font-semibold">
              ({item.selectedOption})
            </span>
          )}
        </h3>
      </div>

      <div className="flex items-center justify-between gap-4 h-8 mt-2">
        {/* 2. Menu Price */}
        <p className="text-sm font-semibold text-black">
          {formatCurrency(item.unitPrice)}
        </p>

        {/* 3. Quantity Selector (- number +) */}
        <QuantitySelector
          quantity={quantity}
          minQuantity={1}
          setQuantity={setQuantity}
          className="scale-[0.8]"
        />

        {/* 4. "삭제" Button */}
        <button
          className={cn(
            "w-[20%] rounded-full py-2 text-xs font-bold transition-all active:scale-95 bg-cinnamon text-white",
          )}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
