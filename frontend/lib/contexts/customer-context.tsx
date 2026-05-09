"use client";

import React, { createContext, useContext } from "react";
import { CustomerBrief } from "@/lib/definitions";

interface CustomerContextType {
  customer: CustomerBrief;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({
  customer,
  children,
}: {
  customer: CustomerBrief;
  children: React.ReactNode;
}) {
  return (
    <CustomerContext.Provider value={{ customer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
}
