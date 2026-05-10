"use client";

import { useState, useCallback } from "react";
import { formatOrderTime, formatCurrency, cn } from "@/lib/utils";
import { OrderDetail, WebSocketMessage } from "@/lib/definitions";
import { updateOrderIsPaid, updateOrderMemo } from "@/lib/api/orders";
import { updateOrderItemServedStatus } from "@/lib/api/order-items";
import { useWebsocket } from "@/lib/hooks/use-websocket";

interface OrdersTableProps {
  orders: OrderDetail[];
}

export default function OrdersTable({
  orders: initialOrders,
}: OrdersTableProps) {
  const [orders, setOrders] = useState<OrderDetail[]>(initialOrders);
  const [editingMemoOrderId, setEditingMemoOrderId] = useState<string | null>(
    null,
  );
  const [editingMemoValue, setEditingMemoValue] = useState<string>("");

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
      case "ORDER_CREATED": {
        setOrders((prevOrders) => [data, ...prevOrders]);
        break;
      }
      case "MEMO_UPDATED": {
        const { orderId, memo } = data;
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, memo } : order,
          ),
        );
        break;
      }
      case "PAYMENT_CONFIRMED": {
        const { orderId, isPaid } = data;
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
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

  const handleTogglePayment = async (
    orderId: string,
    currentIsPaid: boolean,
  ) => {
    try {
      await updateOrderIsPaid(orderId, { isPaid: !currentIsPaid });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, isPaid: !currentIsPaid }
            : order,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("결제 상태 업데이트에 실패했습니다.");
    }
  };

  const handleToggleServed = async (
    orderId: string,
    menuId: string,
    selectedOption: string | null,
    currentIsServed: boolean,
  ) => {
    try {
      await updateOrderItemServedStatus(
        orderId,
        menuId,
        { isServed: !currentIsServed },
        selectedOption,
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.orderId !== orderId) return order;
          return {
            ...order,
            items:
              order.items?.map((item) =>
                item.menuId === menuId && item.selectedOption === selectedOption
                  ? { ...item, isServed: !currentIsServed }
                  : item,
              ) || null,
          };
        }),
      );
    } catch (error) {
      console.error(error);
      alert("서빙 상태 업데이트에 실패했습니다.");
    }
  };

  const startEditingMemo = (orderId: string, currentMemo: string | null) => {
    setEditingMemoOrderId(orderId);
    setEditingMemoValue(currentMemo || "");
  };

  const saveMemo = async (orderId: string) => {
    try {
      await updateOrderMemo(orderId, { memo: editingMemoValue });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, memo: editingMemoValue }
            : order,
        ),
      );
      setEditingMemoOrderId(null);
    } catch (error) {
      console.error(error);
      alert("메모 업데이트에 실패했습니다.");
    }
  };

  const handleMemoKeyDown = (e: React.KeyboardEvent, orderId: string) => {
    if (e.key === "Enter") {
      saveMemo(orderId);
    } else if (e.key === "Escape") {
      setEditingMemoOrderId(null);
    }
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
            const items = order.items || [];
            const allServed =
              items.length > 0 && items.every((item) => item.isServed);
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
                    {items.map((item, itemIdx) => (
                      <button
                        key={`${orderIdx}-${itemIdx}-${item.menuName}-${item.selectedOption}`}
                        onClick={() =>
                          handleToggleServed(
                            order.orderId,
                            item.menuId,
                            item.selectedOption,
                            item.isServed,
                          )
                        }
                        disabled={!order.isPaid}
                        className={cn(
                          "px-2 py-1 rounded text-xs border transition-colors",
                          "disabled:cursor-not-allowed",
                          order.isPaid
                            ? item.isServed
                              ? "bg-moss-green text-green border-green"
                              : "border-gray hover:bg-silver"
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
                  <button
                    onClick={() =>
                      handleTogglePayment(order.orderId, order.isPaid)
                    }
                    className="hover:underline focus:outline-none"
                  >
                    {order.isPaid ? (
                      <span className="text-blue font-semibold">입금 완료</span>
                    ) : (
                      <span className="text-red font-semibold">미입금</span>
                    )}
                  </button>
                </td>
                <td
                  className="p-4 text-xs cursor-pointer min-w-[150px]"
                  onClick={() => startEditingMemo(order.orderId, order.memo)}
                >
                  {editingMemoOrderId === order.orderId ? (
                    <input
                      autoFocus
                      className="w-full p-1 border rounded text-black bg-white"
                      value={editingMemoValue}
                      onChange={(e) => setEditingMemoValue(e.target.value)}
                      onBlur={() => saveMemo(order.orderId)}
                      onKeyDown={(e) => handleMemoKeyDown(e, order.orderId)}
                    />
                  ) : (
                    <span className="block w-full min-h-[1.5em]">
                      {order.memo || ""}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
