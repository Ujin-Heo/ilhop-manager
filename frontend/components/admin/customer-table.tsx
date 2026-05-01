"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CustomerTable Root Component
 */
interface TableProps extends React.ComponentProps<"div"> {
  ordered?: boolean;
}

function CustomerTable({ className, ordered = false, ...props }: TableProps) {
  return (
    <div
      data-ordered={ordered}
      className={cn(
        "group/ct flex w-34 h-30 p-2 flex-col justify-between items-center shrink-0 rounded-md bg-white text-med-gray transition-all duration-200 cursor-pointer select-none border border-transparent hover:shadow-md",
        "data-[ordered=true]:bg-blue data-[ordered=true]:text-white",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CustomerTable Header
 */
function CustomerTableHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex justify-between items-center w-full min-h-6",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CustomerTable Number
 */
function CustomerTableNumber({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-bold text-xl whitespace-nowrap leading-none transition-colors",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CustomerTable Entry Time
 */
function CustomerTableTime({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-medium text-xs leading-none transition-colors",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CustomerTable Content area
 */
function CustomerTableContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "w-full flex justify-center items-end gap-1 transition-colors",
        className,
      )}
      {...props}
    />
  );
}

/**
 * CustomerTable Value (e.g., "45분")
 */
function CustomerTableValue({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("text-2xl font-bold leading-none", className)}
      {...props}
    />
  );
}

/**
 * CustomerTable Unit/Label (e.g., "남음")
 */
function CustomerTableUnit({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-xs font-medium leading-none shrink-0", className)}
      {...props}
    />
  );
}

/**
 * CustomerTable Footer area
 */
function CustomerTableFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("w-full flex justify-center", className)} {...props} />
  );
}

/**
 * Action Button (e.g., Clear Table)
 */
function CustomerTableAction({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "w-full py-1 bg-white/30 border-none rounded text-white font-semibold text-xs cursor-pointer hover:bg-white/40 active:scale-[0.98] transition-all",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Main Composed Component
 */
interface CustomerTableMainProps {
  tableNum: number | string;
  tableInfo?: {
    customerNum?: number;
    ordered?: boolean;
    menus?: any[];
    totalPrice?: number;
    entryTime?: string;
    remainingTime?: number;
  };
  ordered?: boolean;
  onClear?: () => void;
  onClick?: () => void;
  className?: string;
}

function CustomerTableMain({
  tableNum,
  tableInfo,
  ordered: orderedProp = true,
  onClear,
  onClick,
  className,
}: CustomerTableMainProps) {
  const isOrdered = tableInfo?.ordered ?? orderedProp;
  const entryTime = "18:37";
  const remainingTime = 45;

  return (
    <CustomerTable className={className} ordered={isOrdered} onClick={onClick}>
      <CustomerTableHeader>
        <CustomerTableNumber>{tableNum}</CustomerTableNumber>
        {isOrdered && <CustomerTableTime>{entryTime} 입장</CustomerTableTime>}
      </CustomerTableHeader>

      {isOrdered && (
        <CustomerTableContent>
          <div className="w-1/6 shrink-0" /> {/* Spacer */}
          <CustomerTableValue>{remainingTime}분</CustomerTableValue>
          <CustomerTableUnit>남음</CustomerTableUnit>
        </CustomerTableContent>
      )}

      {isOrdered && (
        <CustomerTableFooter>
          <CustomerTableAction
            onClick={(e) => {
              e.stopPropagation();
              onClear?.();
            }}
          >
            테이블 비우기
          </CustomerTableAction>
        </CustomerTableFooter>
      )}
    </CustomerTable>
  );
}

export { CustomerTableMain as default };
