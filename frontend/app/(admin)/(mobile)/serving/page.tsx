import ServingList from "@/components/admin/serving-list";
import { ordersData } from "@/lib/placeholder-data";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm">
        <h1 className="text-xl font-black">실시간 서빙 현황</h1>
        <p className="text-xs font-bold text-gray-500">
          터치하여 서빙 완료 표시
        </p>
      </header>
      <ServingList orders={ordersData} />
    </main>
  );
}
