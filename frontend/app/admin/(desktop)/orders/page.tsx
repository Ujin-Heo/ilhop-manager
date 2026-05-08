import OrdersTable from "@/components/admin/orders-table";
import { getOrders } from "@/lib/api/orders";

export default async function Page() {
  const ordersData = await getOrders();

  return (
    <main className="p-4 bg-white">
      <section className="border border-silver rounded-md overflow-hidden bg-white">
        <OrdersTable orders={ordersData} />
      </section>
    </main>
  );
}
