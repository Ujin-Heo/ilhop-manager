import OrdersTable from "@/components/admin/orders-table";
import { ordersData } from "@/lib/placeholder-data";

export default function Page() {
  return (
    <main className="p-4 bg-white">
      <section className="border border-silver rounded-md overflow-hidden bg-white">
        <OrdersTable orders={ordersData} />
      </section>
    </main>
  );
}
