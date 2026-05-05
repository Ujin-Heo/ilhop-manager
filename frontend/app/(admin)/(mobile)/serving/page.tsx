import ServingList from "@/components/admin/serving-list";

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
    <main className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm">
        <h1 className="text-xl font-black">실시간 서빙 현황</h1>
        <p className="text-xs font-bold text-gray-500">
          터치하여 서빙 완료 표시
        </p>
      </header>
      <ServingList orders={data} />
    </main>
  );
}
