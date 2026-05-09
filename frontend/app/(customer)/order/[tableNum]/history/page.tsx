import React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import OrderHistoryTable from "@/components/customer/order-history-table";
import { getCustomers, getCustomerOrderSummary } from "@/lib/api/customers";

export default async function Page({
  params,
}: {
  params: Promise<{ tableNum: string }>;
}) {
  const { tableNum } = await params;
  
  const customer = await getCustomers(parseInt(tableNum), true);
  const orderSummary = await getCustomerOrderSummary(customer.customerId);

  return (
    <main className="flex-1 space-y-8 px-6 pt-6 pb-24">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-deep-brown">주문 내역</h2>
        <Link
          href={`/order/${tableNum}`}
          className="flex items-center gap-1.5 rounded-full bg-deep-brown px-4 py-2 text-lg font-bold text-white transition-transform active:scale-95"
        >
          <X size={24} />
          닫기
        </Link>
      </header>

      <div className="p-4 pt-2 rounded-2xl border border-sepia/10 bg-white/60 shadow-sm backdrop-blur-xs">
        <OrderHistoryTable orderSummary={orderSummary} />
      </div>

      <footer className="flex justify-center">
        <Link
          href={`/order/${tableNum}`}
          className="flex justify-center items-center gap-1.5 w-[90%] p-4 rounded-xl bg-deep-brown text-white text-xl font-semibold transition-all active:scale-95"
        >
          <X size={24} />
          닫기
        </Link>
      </footer>
    </main>
  );
}
