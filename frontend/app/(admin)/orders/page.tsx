import OrdersTable from "@/components/admin/orders-table";

const data = [
  {
    orderId: "550e8400-e29b-41d4-a716-446655440002",
    tableNum: 7,
    customerId: "550e8400-e29b-41d4-a716-446655440000",
    orderTime: "2024-04-12T19:00:00Z",
    totalPrice: 30000,
    depositor: null,
    isPaid: true,
    memo: "현금 결제 완료",
    items: [
      {
        menuName: "치킨 가라아게",
        quantity: 2,
        selectedOption: null,
        isServed: false,
      },
      {
        menuName: "좋은 토닉",
        quantity: 1,
        selectedOption: "살구맛",
        isServed: true,
      },
    ],
  },
  {
    orderId: "550e8400-e29b-41d4-a716-446655440002",
    tableNum: 12,
    customerId: "550e8400-e29b-41d4-a716-446655440000",
    orderTime: "2024-04-12T19:00:00Z",
    totalPrice: 250000,
    depositor: "홍길동",
    isPaid: true,
    memo: null,
    items: [
      {
        menuName: "치킨 가라아게",
        quantity: 2,
        selectedOption: null,
        isServed: true,
      },
    ],
  },
  {
    orderId: "550e8400-e29b-41d4-a716-446655440002",
    tableNum: 12,
    customerId: "550e8400-e29b-41d4-a716-446655440000",
    orderTime: "2024-04-12T19:00:00Z",
    totalPrice: 250000,
    depositor: "김길동",
    isPaid: false,
    memo: null,
    items: [
      {
        menuName: "치킨 가라아게",
        quantity: 2,
        selectedOption: null,
        isServed: false,
      },
    ],
  },
];

export default function Page() {
  return (
    <main className="p-4 bg-white">
      <section className="border border-silver rounded-md overflow-hidden bg-white">
        <OrdersTable orders={data} />
      </section>
    </main>
  );
}
