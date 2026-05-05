import {
  CustomerTableMain,
  CustomerTablePlaceholder,
} from "@/components/admin/customer-table";
import { tableInfos } from "@/lib/placeholder-data";

export default function Page() {
  const maxRow = Math.max(0, ...tableInfos.map((t) => t.gridRow));
  const maxCol = Math.max(0, ...tableInfos.map((t) => t.gridCol));

  return (
    <main className="bg-gray min-h-screen p-10 flex justify-center">
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
              />
            ) : (
              <CustomerTablePlaceholder key={key} />
            );
          }),
        )}
      </div>
    </main>
  );
}
