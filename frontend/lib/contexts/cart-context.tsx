"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { OrderSummaryResponse } from "@/lib/definitions";

interface CartContextType {
  cart: OrderSummaryResponse;
  setCart: React.Dispatch<React.SetStateAction<OrderSummaryResponse>>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<OrderSummaryResponse>({
    totalAmount: 0,
    orderItems: [],
  });

  // 1. 초기 로드 시 localStorage에서 불러오기
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);

  // 2. cart 상태가 변할 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
