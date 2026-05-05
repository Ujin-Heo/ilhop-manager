import NavigationBar from "@/components/admin/navigation-bar";

const links = [
  { name: "테이블 현황", href: "/admin/tables" },

  { name: "주문 현황", href: "/admin/orders" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavigationBar links={links} />
      <div className="pt-nav-bar-height">{children}</div>
    </div>
  );
}
