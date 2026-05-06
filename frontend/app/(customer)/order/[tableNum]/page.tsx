import { menuData } from "@/lib/placeholder-data";
import MenuCard from "@/components/customer/menu-card";

export default function Page() {
  const foodItems = menuData.filter((item) => item.section === "안주류");
  const drinkItems = menuData.filter((item) => item.section === "주류");

  return (
    <main className="flex-1 space-y-8 px-6 pt-6 pb-24">
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
  );
}
