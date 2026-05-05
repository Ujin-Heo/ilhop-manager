"use client";

import { useState } from "react";
import { formatOrderTime, cn } from "@/lib/utils";

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

export default function ServingList({
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
    <ul className="w-full space-y-4 p-4">
      {orders.map((order, orderIdx) => {
        const allServed = order.items.every((item) => item.isServed);
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
              {order.items.map((item, itemIdx) => (
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

            {/* {order.memo && (
              <div className="mt-4 rounded-lg bg-black/5 p-3 text-xs">
                <span className="font-bold">메모: </span>
                {order.memo}
              </div>
            )} */}
          </li>
        );
      })}
    </ul>
  );
}
