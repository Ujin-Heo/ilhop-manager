"use client";

import { useState, useEffect, useCallback } from "react";
import ServingCard from "@/components/admin/serving-card";
import { getOrders } from "@/lib/api/orders";
import { OrderDetail, WebSocketMessage } from "@/lib/definitions";
import { useWebsocket } from "@/lib/hooks/use-websocket";
import { updateOrderItemServedStatus } from "@/lib/api/order-items";

export default function Page() {
  const [orders, setOrders] = useState<OrderDetail[]>([]);

  useEffect(() => {
    fetchPaidOrders();
  }, []);

  const fetchPaidOrders = async () => {
    try {
      const paidOrdersData = await getOrders(true); // Only fetch paid orders for serving
      setOrders(paidOrdersData);
    } catch (error) {
      console.error(error);
      alert("주문 내역을 불러오는 데 실패했습니다.");
    }
  };

  const handleToggleServed = async (
    orderId: string,
    menuId: string,
    selectedOption: string | null,
    isServed: boolean,
  ) => {
    // Optimistic Update
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.orderId !== orderId) return order;
        return {
          ...order,
          items:
            order.items?.map((item) =>
              item.menuId === menuId && item.selectedOption === selectedOption
                ? { ...item, isServed }
                : item,
            ) || null,
        };
      }),
    );

    try {
      await updateOrderItemServedStatus(
        orderId,
        menuId,
        { isServed },
        selectedOption,
      );
    } catch (error) {
      console.error(error);
      alert("서빙 상태 업데이트에 실패했습니다.");
      // Rollback on error
      fetchPaidOrders();
    }
  };

  const handleWebsocketMessage = useCallback((message: WebSocketMessage) => {
    const { event, data } = message;
    switch (event) {
      case "ITEM_SERVED_UPDATED": {
        const { orderId, menuId, selectedOption, isServed } = data;
        setOrders((prevOrders) =>
          prevOrders.map((order) => {
            if (order.orderId !== orderId) return order;
            return {
              ...order,
              items:
                order.items?.map((item) =>
                  item.menuId === menuId &&
                  item.selectedOption === selectedOption
                    ? { ...item, isServed }
                    : item,
                ) || null,
            };
          }),
        );
        break;
      }
      case "PAYMENT_CONFIRMED": {
        const { orderId, isPaid } = data;
        if (isPaid) {
          fetchPaidOrders();
        } else {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.orderId === orderId ? { ...order, isPaid } : order,
            ),
          );
        }
        break;
      }
      case "ORDER_CREATED": {
        if (data.isPaid) {
          setOrders((prev) => [...prev, data]);
        } else break;
      }
      default:
        break;
    }
  }, []);

  useWebsocket({ onMessage: handleWebsocketMessage });

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm">
        <h1 className="text-xl font-black">실시간 서빙 현황</h1>
        <p className="text-xs font-bold text-gray-500">
          터치하여 서빙 완료 표시
        </p>
      </header>
      <ul className="w-full space-y-4 p-4">
        {orders.map((order) => {
          return (
            <ServingCard
              key={order.orderId}
              order={order}
              onToggle={handleToggleServed}
            />
          );
        })}
      </ul>
    </main>
  );
}
