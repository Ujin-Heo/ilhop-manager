"use client";

import { useState } from "react";
import { formatOrderTime, cn } from "@/lib/utils";
import { OrderDetail } from "@/lib/definitions";

interface ServingListProps {
  orders: OrderDetail[];
}

export default function ServingList({
  orders: initialOrders,
}: ServingListProps) {
  const [orders, setOrders] = useState<OrderDetail[]>(initialOrders);

  const toggleItemServed = (orderIndex: number, itemIndex: number) => {
    const newOrders = [...orders];
    const items = newOrders[orderIndex].items;
    if (items && items[itemIndex]) {
      items[itemIndex].isServed = !items[itemIndex].isServed;
      setOrders(newOrders);
    }
  };

  return (
    <ul className="w-full space-y-4 p-4">
      {orders.map((order, orderIdx) => {
        const items = order.items || [];
        const allServed = items.length > 0 && items.every((item) => item.isServed);
        const cardBgColor = allServed
          ? "bg-light-green text-green" // 모든 메뉴 서빙 완료 시
          : "bg-white text-black"; // 서빙 미완료 시

        return (
          <li
            key={`${order.orderId}-${orderIdx}`}
            className={cn(
              "rounded-xl border p-4 shadow-sm transition-colors",
              cardBgColor,
            )}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black">{order.tableNum}</span>
                <span className="text-sm font-bold">번 테이블</span>
              </div>
              <span className="text-sm font-medium opacity-70">
                {formatOrderTime(order.orderTime)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {items.map((item, itemIdx) => (
                <button
                  key={`${orderIdx}-${itemIdx}-${item.menuName}-${item.selectedOption}`}
                  onClick={() => toggleItemServed(orderIdx, itemIdx)}
                  disabled={!order.isPaid}
                  className={cn(
                    "px-3 py-3 rounded-lg text-left text-sm font-semibold border transition-all",
                    item.isServed
                      ? "bg-moss-green text-green border-green"
                      : "bg-white text-black border-dim-charcoal shadow-sm",
                  )}
                >
                  <div className="flex justify-between items-center h-full gap-1">
                    <span className="line-clamp-2 leading-tight text-xs">
                      {item.menuName}
                      {item.selectedOption && (
                        <>
                          <br />
                          <span className="text-xs">
                            ({item.selectedOption})
                          </span>
                        </>
                      )}
                    </span>
                    <span className="w-fit rounded bg-black/5 px-2 py-0.5 text-xs">
                      x{item.quantity}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
