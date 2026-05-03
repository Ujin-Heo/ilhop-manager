"use client";

import { useState } from "react";
import { formatOrderTime, formatCurrency, cn } from "@/lib/utils";

export interface OrderItem {
  menuName: string;
  quantity: number;
  selectedOption: string | null;
  isServed: boolean;
}

export interface OrderInfo {
  orderId: string;
  tableNum: number;
  customerId: string;
  orderTime: string;
  totalPrice: number;
  depositor: string | null;
  isPaid: boolean;
  memo: string | null;
  items: OrderItem[];
}

interface OrdersTableProps {
  orders: OrderInfo[];
}

export default function OrdersTable({
  orders: initialOrders,
}: OrdersTableProps) {
  const [orders, setOrders] = useState<OrderInfo[]>(initialOrders);

  const toggleItemServed = (orderIndex: number, itemIndex: number) => {
    const newOrders = [...orders];
    newOrders[orderIndex].items[itemIndex].isServed =
      !newOrders[orderIndex].items[itemIndex].isServed;
    setOrders(newOrders);
  };

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-charcoal border-b-2 bg-white text-left font-medium">
            <th className="p-4">주문 시각</th>
            <th className="p-4">테이블 번호</th>
            <th className="p-4">주문 내역</th>
            <th className="p-4">총액</th>
            <th className="p-4">입금자명</th>
            <th className="p-4">입금 여부</th>
            <th className="p-4">비고</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, orderIdx) => {
            const allServed = order.items.every((item) => item.isServed);
            const rowBgColor = !order.isPaid
              ? "bg-charcoal text-silver opacity-60" // 미입금 시
              : order.isPaid && allServed
                ? "bg-light-green text-green" // 임금 & 모든 메뉴 서빙 완료 시
                : "bg-white text-black"; // 임금만 완료 시

            return (
              <tr
                key={`${order.orderId}-${orderIdx}`}
                className={cn("border-b transition-colors", rowBgColor)}
              >
                <td className="p-4">{formatOrderTime(order.orderTime)}</td>
                <td className="p-4">{order.tableNum}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, itemIdx) => (
                      <button
                        key={`${orderIdx}-${itemIdx}-${item.menuName}-${item.selectedOption}`}
                        onClick={() => toggleItemServed(orderIdx, itemIdx)}
                        disabled={!order.isPaid}
                        className={cn(
                          "px-2 py-1 rounded text-xs border transition-colors",
                          "disabled:cursor-not-allowed",
                          order.isPaid
                            ? item.isServed
                              ? "bg-moss-green text-green border-green"
                              : "border-dim-charcoal hover:bg-silver"
                            : "border-silver",
                        )}
                      >
                        {item.menuName}
                        {item.selectedOption
                          ? ` (${item.selectedOption})`
                          : ""}{" "}
                        x{item.quantity}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="p-4">{formatCurrency(order.totalPrice)}</td>
                <td className="p-4">{order.depositor || ""}</td>
                <td className="p-4">
                  {order.isPaid ? (
                    <span className="text-blue font-semibold">입금 완료</span>
                  ) : (
                    <span className="text-red font-semibold">미입금</span>
                  )}
                </td>
                <td className="p-4 text-xs">{order.memo || ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
