"use client";

import { OrderDetail, WebSocketMessage } from "@/lib/definitions";
import { formatCurrency } from "@/lib/utils";
import { useState, useCallback, useMemo } from "react";
import { useWebsocket } from "@/lib/hooks/use-websocket";

interface OrdersFooterProps {
  initialOrders: OrderDetail[];
  totalCustomers: number;
}

export default function OrdersFooter({
  initialOrders,
  totalCustomers,
}: OrdersFooterProps) {
  const [orders, setOrders] = useState<OrderDetail[]>(initialOrders);

  const handleWebsocketMessage = useCallback((message: WebSocketMessage) => {
    const { event, data } = message;
    switch (event) {
      case "ORDER_CREATED": {
        setOrders((prev) => [data, ...prev]);
        break;
      }
      case "PAYMENT_CONFIRMED": {
        const { orderId, isPaid } = data;
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId ? { ...order, isPaid } : order,
          ),
        );
        break;
      }
      default:
        break;
    }
  }, []);

  useWebsocket({ onMessage: handleWebsocketMessage });

  const stats = useMemo(() => {
    const paidOrders = orders.filter((o) => o.isPaid);
    const totalRevenue = paidOrders.reduce((acc, o) => acc + o.totalPrice, 0);
    return {
      totalOrders: paidOrders.length,
      totalRevenue,
    };
  }, [orders]);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-silver text-white p-4 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto flex justify-around items-center font-bold text-lg">
        <div className="flex items-center gap-4">
          <span className="text-black">총 손님 수</span>
          <span className="text-2xl text-cinnamon">{totalCustomers}명</span>
        </div>
        <div className="w-px h-8 bg-silver/20" />
        <div className="flex items-center gap-4">
          <span className="text-black">총 주문 수</span>
          <span className="text-2xl text-green">{stats.totalOrders}건</span>
        </div>
        <div className="w-px h-8 bg-silver/20" />
        <div className="flex items-center gap-4">
          <span className="text-black">총 수입</span>
          <span className="text-2xl text-blue">
            {formatCurrency(stats.totalRevenue)}
          </span>
        </div>
      </div>
    </footer>
  );
}
