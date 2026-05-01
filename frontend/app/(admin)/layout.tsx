import NavigationBar from "@/components/admin/navigation-bar";

const links = [
  { name: "테이블 현황", href: "/tables" },

  { name: "주문 현황", href: "/orders" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavigationBar links={links} />
      <div className="pt-12">{children}</div>
    </div>
  );
}
