import NavigationBar from "@/components/admin/navigation-bar";
import { getMetadata } from "@/lib/api/metadata";

const links = [
  { name: "테이블 현황", href: "/admin/tables" },

  { name: "주문 현황", href: "/admin/orders" },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let title = "그루터기 일일호프";
  try {
    const meta = await getMetadata();
    if (meta && meta.title) {
      title = meta.title;
    }
  } catch (error) {
    console.error("Failed to fetch metadata for admin layout:", error);
  }

  return (
    <div>
      <NavigationBar links={links} title={title} />
      <div className="pt-nav-bar-height">{children}</div>
    </div>
  );
}
