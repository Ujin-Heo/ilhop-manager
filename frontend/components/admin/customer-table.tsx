"use client";

import * as React from "react";
import { cn, formatEntryTime, calculateRemainingTime } from "@/lib/utils";
import { CustomerBrief, TableStatus } from "@/lib/definitions";
import { Plus, Trash2, X, UserPlus } from "lucide-react";
import { createTable } from "@/lib/api/tables";
import {
  createCustomer,
  updateCustomerActiveStatus,
  updateCustomerIsExtended,
} from "@/lib/api/customers";

/**
 * CustomerTable Root Component
 */
interface TableProps extends React.ComponentProps<"div"> {
  ordered?: boolean;
  warning?: "none" | "yellow" | "red";
}

function CustomerTable({
  className,
  ordered = false,
  warning = "none",
  ...props
}: TableProps) {
  return (
    <div
      data-ordered={ordered && warning === "none"}
      data-warning={warning}
      className={cn(
        "group/ct relative flex w-34 h-30 p-2 flex-col justify-between items-center shrink-0 rounded-md bg-white text-med-gray transition-all duration-200 cursor-pointer select-none border border-transparent hover:shadow-md",
        "data-[ordered=true]:bg-blue data-[ordered=true]:text-white",
        "data-[warning=yellow]:bg-warning-yellow data-[warning=yellow]:text-black",
        "data-[warning=red]:bg-warning-red data-[warning=red]:text-white",
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
  tableId?: string;
  tableNum: number;
  currentCustomer?: CustomerBrief | null;
  onCustomerCleared?: () => void;
  onCustomerCreated?: (customer: CustomerBrief) => void;
  onCustomerUpdated?: (customer: CustomerBrief) => void;
  onClick?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  className?: string;
  standardTime?: number;
  extraTime?: number;
}

function CustomerTableMain({
  tableNum,
  currentCustomer,
  onCustomerCleared,
  onCustomerCreated,
  onCustomerUpdated,
  onClick,
  onDelete,
  isEditing = false,
  className,
  standardTime = 90,
  extraTime = 60,
}: CustomerTableMainProps) {
  const [isAddingCustomer, setIsAddingCustomer] = React.useState(false);
  const isOrdered = !!currentCustomer;
  const rawEntryTime = currentCustomer?.entryTime;
  const formattedEntryTime = rawEntryTime ? formatEntryTime(rawEntryTime) : "";
  const remainingTime = rawEntryTime
    ? calculateRemainingTime(
        rawEntryTime,
        standardTime,
        currentCustomer?.isExtended,
        extraTime,
      )
    : 0;

  const warning: "none" | "yellow" | "red" = !isOrdered
    ? "none"
    : remainingTime < 0
      ? "red"
      : remainingTime < 30
        ? "yellow"
        : "none";

  const handleAddCustomer = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newCustomer = await createCustomer({ tableNum });
      setIsAddingCustomer(false);
      onCustomerCreated?.(newCustomer);
    } catch (error: any) {
      alert(error.message || "손님 추가에 실패했습니다.");
    }
  };

  const handleExtend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCustomer) return;

    const isExtended = currentCustomer.isExtended;
    const confirmMsg = isExtended
      ? "시간 연장을 취소하시겠습니까?"
      : `이용 시간을 ${extraTime}분 연장하시겠습니까?`;

    if (!confirm(confirmMsg)) return;

    try {
      const updatedCustomer = await updateCustomerIsExtended(
        currentCustomer.customerId,
        !isExtended,
      );
      onCustomerUpdated?.(updatedCustomer);
    } catch (error: any) {
      alert(error.message || "상태 변경에 실패했습니다.");
    }
  };

  const handleClearTable = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCustomer) return;
    if (!confirm("정말 이 테이블을 비우시겠습니까? (퇴장 처리)")) return;

    try {
      await updateCustomerActiveStatus(currentCustomer.customerId, false);
      onCustomerCleared?.();
    } catch (error: any) {
      alert(error.message || "테이블 비우기에 실패했습니다.");
    }
  };

  const handleTableClick = () => {
    if (isEditing) return;
    if (!isOrdered) {
      setIsAddingCustomer(!isAddingCustomer);
    }
    onClick?.();
  };

  return (
    <CustomerTable
      className={cn(className, isEditing && "cursor-default hover:shadow-none")}
      ordered={isOrdered}
      warning={warning}
      onClick={handleTableClick}
    >
      <CustomerTableHeader>
        <div className="flex items-center gap-1.5">
          <CustomerTableNumber>{tableNum}</CustomerTableNumber>
          {isOrdered && !isEditing && (
            <button
              onClick={handleExtend}
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-bold border transition-all",
                currentCustomer.isExtended
                  ? "bg-black text-white border-black hover:bg-black/80"
                  : "bg-white text-black border-silver hover:bg-gray",
              )}
            >
              연장
            </button>
          )}
        </div>
        {isOrdered && (
          <CustomerTableTime>{formattedEntryTime} 입장</CustomerTableTime>
        )}
      </CustomerTableHeader>

      {isOrdered ? (
        <CustomerTableContent>
          <div className="w-1/6 shrink-0" /> {/* Spacer */}
          {remainingTime < 0 ? (
            <>
              <CustomerTableValue>
                {Math.abs(remainingTime)}분
              </CustomerTableValue>
              <CustomerTableUnit>초과</CustomerTableUnit>
            </>
          ) : (
            <>
              <CustomerTableValue>{remainingTime}분</CustomerTableValue>
              <CustomerTableUnit>남음</CustomerTableUnit>
            </>
          )}
        </CustomerTableContent>
      ) : (
        !isEditing &&
        isAddingCustomer && (
          <div className="flex flex-1 w-full items-center justify-center">
            <CustomerTableAction
              onClick={handleAddCustomer}
              className="flex items-center justify-center gap-2 border border-silver bg-white/20 pb-4 font-bold text-sm text-med-gray hover:bg-white/40"
            >
              <UserPlus size={18} />
              <span>손님 추가</span>
            </CustomerTableAction>
          </div>
        )
      )}

      {isOrdered && (
        <CustomerTableFooter className={cn(isEditing && "invisible")}>
          <CustomerTableAction onClick={handleClearTable} disabled={isEditing}>
            테이블 비우기
          </CustomerTableAction>
        </CustomerTableFooter>
      )}

      {isEditing && !isOrdered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-md">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="flex items-center gap-1 rounded-lg border border-red-200 bg-white mt-3 px-3 py-1.5 text-xs font-bold text-red-500 shadow-sm transition-colors hover:bg-red-50"
          >
            <Trash2 size={14} />
            테이블 삭제
          </button>
        </div>
      )}
    </CustomerTable>
  );
}

function CustomerTableSetInfo({
  gridRow,
  gridCol,
  onCancel,
  onCreated,
}: {
  gridRow: number;
  gridCol: number;
  onCancel: () => void;
  onCreated: (newTable: TableStatus) => void;
}) {
  const [tableNum, setTableNum] = React.useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(tableNum);

    if (isNaN(num) || num < 1) {
      alert("1 이상의 숫자를 입력해주세요.");
      return;
    }

    try {
      const newTable = await createTable({
        tableNum: num,
        gridRow,
        gridCol,
      });
      onCreated(newTable);
    } catch (error: any) {
      alert(error.message || "테이블 생성에 실패했습니다.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex h-30 w-34 shrink-0 flex-col items-center justify-between rounded-md border border-blue bg-white p-2 shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-1 right-1 text-med-gray transition-colors hover:text-black"
      >
        <X size={16} />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        <label className="text-med-gray text-[10px] font-bold">
          테이블 번호 입력
        </label>
        <input
          autoFocus
          type="number"
          min="1"
          step="1"
          value={tableNum}
          onChange={(e) => setTableNum(e.target.value)}
          className="w-20 border-b border-silver text-center text-xl font-bold outline-none focus:border-blue [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>

      <CustomerTableFooter>
        <CustomerTableAction type="submit" className="bg-blue hover:bg-blue/80">
          테이블 만들기
        </CustomerTableAction>
      </CustomerTableFooter>
    </form>
  );
}

interface CustomerTablePlaceholderProps {
  gridRow: number;
  gridCol: number;
  isEditing?: boolean;
  onCreated?: (newTable: TableStatus) => void;
}

function CustomerTablePlaceholder({
  gridRow,
  gridCol,
  isEditing = false,
  onCreated,
}: CustomerTablePlaceholderProps) {
  const [isSetting, setIsSetting] = React.useState(false);

  if (isSetting && onCreated) {
    return (
      <CustomerTableSetInfo
        gridRow={gridRow}
        gridCol={gridCol}
        onCancel={() => setIsSetting(false)}
        onCreated={(newTable) => {
          setIsSetting(false);
          onCreated(newTable);
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-30 w-34 shrink-0 items-center justify-center rounded-md transition-all duration-200",
        isEditing
          ? "cursor-pointer border border-dashed border-silver bg-white/40 hover:border-med-gray hover:bg-white/60"
          : "bg-transparent",
      )}
      onClick={() => isEditing && setIsSetting(true)}
    >
      {isEditing && (
        <div className="rounded-full border border-silver bg-white p-2 text-med-gray shadow-sm">
          <Plus size={20} />
        </div>
      )}
    </div>
  );
}

export { CustomerTableMain, CustomerTablePlaceholder, CustomerTableSetInfo };
