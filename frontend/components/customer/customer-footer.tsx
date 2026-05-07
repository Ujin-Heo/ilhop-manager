"use client";

import Link from "next/link";
import { ShoppingBag, ReceiptText } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-context";
import Badge from "@/components/shared/badge";

interface CustomerFooterProps {
  tableNum: string;
}

export default function CustomerFooter({ tableNum }: CustomerFooterProps) {
  const { cart } = useCart();
  const itemCount = cart.orderItems.reduce((acc, item) => acc + item.totalQuantity, 0);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-sepia/10 bg-warm-beige backdrop-blur-md shadow-xs p-4">
      <div className="mx-auto flex w-full max-w-md gap-3">
        <Link
          href={`/order/${tableNum}/cart`}
          className="relative flex flex-1 items-center justify-center gap-2 rounded-xl border border-sepia/20 bg-white/50 py-4 text-base font-bold text-deep-brown active:scale-95"
        >
          <ShoppingBag size={20} />
          장바구니
          <Badge count={itemCount} />
        </Link>
        <Link
          href={`/order/${tableNum}/history`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-deep-brown py-4 text-base font-bold text-white active:scale-95"
        >
          <ReceiptText size={20} />
          주문내역
        </Link>
      </div>
    </footer>
  );
}
