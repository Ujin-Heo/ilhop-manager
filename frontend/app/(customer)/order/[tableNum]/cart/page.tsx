import React, { use } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { orderHistory } from "@/lib/placeholder-data";
import CartItem from "@/components/customer/cart-item";
import { formatCurrency } from "@/lib/utils";

export default function Page({
  params,
}: {
  params: Promise<{ tableNum: string }>;
}) {
  const { tableNum } = use(params);
  const items = orderHistory.orderItems;
  const totalAmount = orderHistory.totalAmount;

  return (
    <main className="flex-1 space-y-8 px-6 pt-6 pb-24">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-deep-brown">주문 내역</h2>
        <Link
          href={`/order/${tableNum}`}
          className="flex items-center gap-1.5 rounded-full bg-deep-brown px-4 py-2 text-lg font-bold text-white transition-all active:scale-95"
        >
          <X size={24} />
          닫기
        </Link>
      </header>

      <ul className="grid grid-cols-1 gap-2">
        {items.map((item, itemIdx) => (
          <li key={`${itemIdx}-${item.menuName}`}>
            <CartItem item={item} />
          </li>
        ))}
      </ul>

      <footer className="flex flex-col gap-4 pr-3">
        <h1 className="flex justify-end items-baseline gap-2 text-red">
          <span className="text-xl font-bold">합계</span>
          <span className="text-3xl font-bold">
            {formatCurrency(totalAmount)}
          </span>
        </h1>

        <div className="w-full flex justify-between items-center gap-2">
          <Link
            className="flex-1 p-4 rounded-xl bg-deep-brown text-center text-white text-xl font-semibold transition-all active:scale-95"
            href={`/order/${tableNum}`}
          >
            닫기
          </Link>
          <button className="flex-3 p-4 rounded-xl bg-cinnamon text-white text-xl font-semibold transition-all active:scale-95">
            주문하기
          </button>
        </div>
      </footer>
    </main>
  );
}
