import React, { use } from "react";
import Link from "next/link";
import { ShoppingBag, ReceiptText } from "lucide-react";

interface CustomerLayoutProp {
  params: Promise<{ tableNum: string }>;
  children: React.ReactNode;
}

export default function CustomerLayout({
  params,
  children,
}: CustomerLayoutProp) {
  const { tableNum } = use(params);

  return (
    <div className="flex min-h-screen flex-col bg-warm-beige">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sepia/10 bg-warm-beige backdrop-blur-md shadow-sm px-6 py-4">
        <Link href={`/order/${tableNum}`} className="active:scale-95">
          <h1 className="text-xl font-bold text-black">그루터기 일일호프</h1>
        </Link>
        <span className="text-base font-semibold text-sepia">
          {tableNum}번 테이블
        </span>
      </header>

      {children}

      <footer className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-sepia/10 bg-warm-beige backdrop-blur-md shadow-xs p-4">
        <div className="mx-auto flex w-full max-w-md gap-3">
          <Link
            href={`/order/${tableNum}/cart`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-sepia/20 bg-white/50 py-4 text-base font-bold text-deep-brown active:scale-95"
          >
            <ShoppingBag size={20} />
            장바구니
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
    </div>
  );
}
