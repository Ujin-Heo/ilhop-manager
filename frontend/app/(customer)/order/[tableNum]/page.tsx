import { menuData } from "@/lib/placeholder-data";
import MenuCard from "@/components/customer/menu-card";
import { ShoppingBag, ReceiptText } from "lucide-react";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ tableNum: string }>;
}) {
  const { tableNum } = use(params);

  const foodItems = menuData.filter((item) => item.section === "안주류");
  const drinkItems = menuData.filter((item) => item.section === "주류");

  return (
    <div className="flex min-h-screen flex-col bg-warm-beige">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sepia/10 bg-warm-beige backdrop-blur-md shadow-sm px-6 py-4">
        <h1 className="text-xl font-bold text-black">그루터기 일일호프</h1>
        <span className="text-base font-semibold text-sepia">
          {tableNum}번 테이블
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-8 px-6 pt-6 pb-24">
        {/* 2. Section: 안주류 */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-deep-brown">안주류</h2>
          <ul className="grid grid-cols-1 gap-4">
            {foodItems.map((menu) => (
              <li key={menu.menuId}>
                <MenuCard menu={menu} />
              </li>
            ))}
          </ul>
        </section>

        {/* 3. Section: 주류 */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-deep-brown">주류</h2>
          <ul className="grid grid-cols-1 gap-4">
            {drinkItems.map((menu) => (
              <li key={menu.menuId}>
                <MenuCard menu={menu} />
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* 4. Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-sepia/10 bg-warm-beige backdrop-blur-md shadow-xs p-4">
        <div className="mx-auto flex w-full max-w-md gap-3">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-sepia/20 bg-white/50 py-4 text-base font-bold text-deep-brown active:scale-95">
            <ShoppingBag size={20} />
            장바구니
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-deep-brown py-4 text-base font-bold text-white active:scale-95">
            <ReceiptText size={20} />
            주문내역
          </button>
        </div>
      </footer>
    </div>
  );
}
