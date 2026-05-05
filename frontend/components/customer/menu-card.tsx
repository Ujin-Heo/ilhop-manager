"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { MenuResponse } from "@/lib/definitions";
import { formatCurrency, cn } from "@/lib/utils";

interface MenuCardProps {
  menu: MenuResponse;
}

export default function MenuCard({ menu }: MenuCardProps) {
  const [quantity, setQuantity] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>(
    menu.options && menu.options.length > 0 ? menu.options[0] : "",
  );

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-sepia/10 bg-white/80 p-4 shadow-md gap-4">
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col justify-center gap-1">
          {/* 1. Menu Name */}
          <h3 className="text-lg font-bold text-deep-brown leading-tight">
            {menu.menuName}
          </h3>
          {/* 2. Menu Price */}
          <p className="text-base font-semibold text-sepia">
            {formatCurrency(menu.price)}
          </p>
        </div>

        {/* 3. Menu Image */}
        {menu.imageUrl && (
          <div className="relative w-1/3 aspect-square shrink-0 overflow-hidden rounded-xl">
            <Image
              src={menu.imageUrl}
              alt={menu.menuName}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* 4. Dropdown for selecting options */}
      {menu.options && menu.options.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-sepia">옵션 선택</label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="w-full rounded-lg border border-sepia/20 bg-warm-beige/50 p-2.5 text-sm font-medium text-deep-brown focus:border-cinnamon focus:outline-none focus:ring-0"
          >
            {menu.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-2">
        {/* 5. Quantity Selector (- number +) */}
        <div className="flex items-center gap-1 rounded-full border border-sepia/20 p-1">
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

        {/* 6. "담기" Button */}
        <button
          className={cn(
            "flex-1 rounded-full py-3 text-sm font-bold transition-all active:scale-95",
            quantity > 0
              ? "bg-cinnamon text-white"
              : "bg-sepia/1 text-sepia/40 cursor-not-allowed",
          )}
          disabled={quantity === 0}
        >
          담기
        </button>
      </div>
    </div>
  );
}
