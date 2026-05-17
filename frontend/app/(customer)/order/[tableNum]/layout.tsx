import React from "react";
import Link from "next/link";
import { CartProvider } from "@/lib/contexts/cart-context";
import { CustomerProvider } from "@/lib/contexts/customer-context";
import CustomerFooter from "@/components/customer/customer-footer";
import { getCustomers } from "@/lib/api/customers";
import { getMetadata } from "@/lib/api/metadata";
import { CustomerBrief } from "@/lib/definitions";

interface CustomerLayoutProp {
  params: Promise<{ tableNum: string }>;
  children: React.ReactNode;
}

export default async function CustomerLayout({
  params,
  children,
}: CustomerLayoutProp) {
  const { tableNum } = await params;

  let customers: CustomerBrief[] = [];
  let title = "그루터기 일일호프";

  try {
    const [customerList, meta] = await Promise.all([
      getCustomers(parseInt(tableNum), true),
      getMetadata(),
    ]);
    customers = customerList;
    if (meta && meta.title) {
      title = meta.title;
    }
  } catch (_e) {
    // metadata or customer fetch failed
  }

  const customer = customers[0];

  if (!customer) {
    return (
      <div className="flex min-h-screen flex-col bg-warm-beige">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sepia/10 bg-warm-beige backdrop-blur-md shadow-sm px-6 py-4">
          <Link href={`/order/${tableNum}`} className="active:scale-95">
            <h1 className="text-xl font-bold text-black">{title}</h1>
          </Link>
          <span className="text-base font-semibold text-sepia">
            {tableNum}번 테이블
          </span>
        </header>
        <main className="flex flex-1 items-center justify-center p-6 text-center">
          <div className="rounded-2xl bg-white/60 p-8 shadow-sm backdrop-blur-sm border border-sepia/10">
            <p className="text-lg font-bold text-deep-brown leading-relaxed">
              현재 이 테이블에 배정된 손님이 없습니다.
              <br />
              직원에게 문의 바랍니다.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <CustomerProvider customer={customer}>
      <CartProvider>
        <div className="flex min-h-screen flex-col bg-warm-beige">
          <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sepia/10 bg-warm-beige backdrop-blur-md shadow-sm px-6 py-4">
            <Link href={`/order/${tableNum}`} className="active:scale-95">
              <h1 className="text-xl font-bold text-black">{title}</h1>
            </Link>
            <span className="text-base font-semibold text-sepia">
              {tableNum}번 테이블
            </span>
          </header>

          {children}

          <CustomerFooter tableNum={tableNum} />
        </div>
      </CartProvider>
    </CustomerProvider>
  );
}
