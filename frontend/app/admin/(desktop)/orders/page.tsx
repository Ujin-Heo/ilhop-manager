import OrdersTable from "@/components/admin/orders-table";
import OrdersFooter from "@/components/admin/orders-footer";
import { getOrders } from "@/lib/api/orders";
import { getCustomers } from "@/lib/api/customers";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Page() {
  const cookieStore = await cookies();
  const [ordersData, customersData] = await Promise.all([
    getOrders(undefined, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    }),
    getCustomers(undefined, undefined, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    }),
  ]);

  return (
    <main className="p-4 bg-white pb-24">
      <section className="border border-silver rounded-md overflow-hidden bg-white">
        <OrdersTable orders={ordersData} />
      </section>
      <OrdersFooter initialOrders={ordersData} totalCustomers={customersData.length} />
    </main>
  );
}
