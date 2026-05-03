import {
  CustomerTableMain,
  CustomerTablePlaceholder,
} from "@/components/admin/customer-table";

const tableInfos = [
  {
    tableId: "550e8400-e29b-41d4-a716-446655440000",
    tableNum: 3,
    gridRow: 1,
    gridCol: 1,
    isAvailable: true,
    currentCustomer: {
      customerId: "550e8400-e29b-41d4-a716-446655440000",
      entryTime: "2026-05-02T02:30:30Z",
      isActive: true,
    },
  },
  {
    tableId: "550e8400-e29b-41d4-a716-446655440000",
    tableNum: 22,
    gridRow: 4,
    gridCol: 8,
    isAvailable: true,
    currentCustomer: {
      customerId: "550e8400-e29b-41d4-a716-446655440000",
      entryTime: "2026-05-02T02:25:30Z",
      isActive: true,
    },
  },
  {
    tableId: "550e8400-e29b-41d4-a716-446655440000",
    tableNum: 7,
    gridRow: 3,
    gridCol: 2,
    isAvailable: true,
    currentCustomer: null,
  },
  {
    tableId: "550e8400-e29b-41d4-a716-446655440000",
    tableNum: 12,
    gridRow: 2,
    gridCol: 6,
    isAvailable: true,
    currentCustomer: null,
  },
];

export default function Page() {
  const maxRow = Math.max(0, ...tableInfos.map((t) => t.gridRow));
  const maxCol = Math.max(0, ...tableInfos.map((t) => t.gridCol));

  return (
    <main className="bg-med-gray min-h-screen p-10 flex justify-center">
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
                ordered={!!table.currentCustomer}
                tableInfo={{
                  entryTime: table.currentCustomer?.entryTime,
                }}
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
