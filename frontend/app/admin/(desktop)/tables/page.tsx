"use client";

import { useEffect, useState } from "react";
import {
  CustomerTableMain,
  CustomerTablePlaceholder,
} from "@/components/admin/customer-table";
import { getTables, deleteTable } from "@/lib/api/tables";
import { getMetadata } from "@/lib/api/metadata";
import { TableStatus, MetaDataResponse } from "@/lib/definitions";
import { Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Page() {
  const [tableInfos, setTableInfos] = useState<TableStatus[]>([]);
  const [metadata, setMetadata] = useState<MetaDataResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [tablesData, metaData] = await Promise.all([
        getTables(),
        getMetadata(),
      ]);
      setTableInfos(tablesData);
      setMetadata(metaData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteTable = async (tableId: string) => {
    if (!confirm("정말 이 테이블을 삭제하시겠습니까?")) return;

    try {
      await deleteTable(tableId);
      setTableInfos((prev) => prev.filter((t) => t.tableId !== tableId));
    } catch (error) {
      alert("테이블 삭제에 실패했습니다.");
      console.error(error);
    }
  };

  const maxRow = metadata?.maxTableRow || Math.max(0, ...tableInfos.map((t) => t.gridRow), 5);
  const maxCol = metadata?.maxTableCol || Math.max(0, ...tableInfos.map((t) => t.gridCol), 8);

  if (isLoading) {
    return (
      <main className="bg-gray min-h-screen p-10 flex justify-center items-center text-med-gray font-bold">
        로딩 중...
      </main>
    );
  }

  return (
    <main className="bg-gray min-h-screen p-10 flex justify-center relative">
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${maxRow}, min-content)`,
          gridTemplateColumns: `repeat(${maxCol}, min-content)`,
          rowGap: "2.5rem",
          columnGap: "1rem",
        }}
      >
        {Array.from({ length: maxRow }, (_, r) =>
          Array.from({ length: maxCol }, (_, c) => {
            const table = tableInfos.find(
              (t) => t.gridRow === r + 1 && t.gridCol === c + 1,
            );
            const key = `grid-${r + 1}-${c + 1}`;

            return table ? (
              <CustomerTableMain
                key={key}
                tableNum={table.tableNum}
                currentCustomer={table.currentCustomer}
                isEditing={isEditing}
                standardTime={metadata?.standardTime}
                extraTime={metadata?.extraTime}
                onDelete={() => handleDeleteTable(table.tableId)}
                onCustomerCreated={(newCustomer) => {
                  setTableInfos((prev) =>
                    prev.map((t) =>
                      t.tableId === table.tableId
                        ? { ...t, currentCustomer: newCustomer }
                        : t,
                    ),
                  );
                }}
                onCustomerUpdated={(updatedCustomer) => {
                  setTableInfos((prev) =>
                    prev.map((t) =>
                      t.tableId === table.tableId
                        ? { ...t, currentCustomer: updatedCustomer }
                        : t,
                    ),
                  );
                }}
                onCustomerCleared={() => {
                  setTableInfos((prev) =>
                    prev.map((t) =>
                      t.tableId === table.tableId
                        ? { ...t, currentCustomer: null }
                        : t,
                    ),
                  );
                }}
              />
            ) : (
              <CustomerTablePlaceholder
                key={key}
                gridRow={r + 1}
                gridCol={c + 1}
                isEditing={isEditing}
                onCreated={(newTable) => {
                  setTableInfos((prev) => [...prev, newTable]);
                }}
              />
            );
          }),
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsEditing(!isEditing)}
        className={cn(
          "fixed bottom-10 right-10 flex items-center gap-2 px-6 py-4 rounded-full shadow-lg transition-all active:scale-95 z-50",
          isEditing
            ? "bg-white text-black border border-silver hover:bg-gray"
            : "bg-black text-white hover:bg-black/80",
        )}
      >
        {isEditing ? (
          <>
            <X size={20} />
            <span className="font-bold">수정 모드 종료</span>
          </>
        ) : (
          <>
            <Pencil size={20} />
            <span className="font-bold">테이블 배치 수정</span>
          </>
        )}
      </button>
    </main>
  );
}
