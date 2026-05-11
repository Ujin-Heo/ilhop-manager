"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Settings } from "lucide-react";

interface NavLink {
  name: string;
  href: string;
}

interface NavigationBarProps {
  links: NavLink[];
}

function NavigationBar({ links }: NavigationBarProps) {
  const pathname = usePathname();

  return (
    <nav className="flex w-full h-nav-bar-height pl-15 pr-30 justify-between items-center fixed top-0 z-50 bg-silver">
      <Link href="/admin" className="transition-all active:scale-95">
        <h1 className="font-bold text-xl text-black ">
          그루터기 일일호프 관리자 페이지
        </h1>
      </Link>
      <div className="flex items-center gap-x-20">
        <ul className="flex justify-between items-end gap-x-20">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx("flex justify-center items-center text-black", {
                "font-bold underline decoration-2 underline-offset-4":
                  pathname === link.href,
              })}
            >
              <p>{link.name}</p>
            </Link>
          ))}
        </ul>
        <Link
          href="/admin/settings"
          className={clsx(
            "p-2 rounded-full hover:bg-black/5 transition-colors",
            {
              "text-cinnamon": pathname === "/admin/settings",
              "text-black": pathname !== "/admin/settings",
            },
          )}
        >
          <Settings size={24} />
        </Link>
      </div>
    </nav>
  );
}

export default NavigationBar;
