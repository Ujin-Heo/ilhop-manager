"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

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
    <nav className="flex w-full h-12 pl-15 pr-30 justify-between items-center fixed top-0 z-50 bg-light-gray">
      <h1 className="font-bold text-xl">그루터기 일일호프</h1>
      <ul className="flex justify-between items-end gap-x-20">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={clsx("flex justify-center items-center", {
              "font-bold": pathname === link.href,
            })}
          >
            <p>{link.name}</p>
          </Link>
        ))}
      </ul>
    </nav>
  );
}

export default NavigationBar;
