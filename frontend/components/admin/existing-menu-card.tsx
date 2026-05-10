import { MenuResponse } from "@/lib/definitions";

interface ExistingMenuCardProps {
  menu: MenuResponse;
}

export default function ExistingMenuCard({ menu }: ExistingMenuCardProps) {
  return (
    <div className="p-4 border border-light-gray rounded-md bg-ghost-white">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs text-sepia font-medium px-2 py-1 bg-pale-gray rounded mb-1 inline-block">
            {menu.section}
          </span>
          <div className="text-lg font-bold text-black">{menu.menuName}</div>
          <div className="text-cinnamon font-semibold">
            {menu.price.toLocaleString()}원
          </div>
        </div>
      </div>
      {menu.options && menu.options.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {menu.options.map((opt, idx) => (
            <span
              key={idx}
              className="text-xs bg-white border border-light-gray px-2 py-0.5 rounded text-sepia"
            >
              {opt}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
