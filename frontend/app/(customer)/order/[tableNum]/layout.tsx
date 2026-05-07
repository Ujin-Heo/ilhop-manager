import React, { use } from "react";
import Link from "next/link";
import { CartProvider } from "@/lib/contexts/cart-context";
import CustomerFooter from "@/components/customer/customer-footer";

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
    <CartProvider>
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

        <CustomerFooter tableNum={tableNum} />
      </div>
    </CartProvider>
  );
}
