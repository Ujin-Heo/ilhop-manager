import { MenuResponse } from "@/lib/definitions";
import { Trash2, Pencil } from "lucide-react";
import { deleteMenu } from "@/lib/api/menus";

interface ExistingMenuCardProps {
  menu: MenuResponse;
  onDelete?: () => void;
  onEdit?: (menu: MenuResponse) => void;
}

export default function ExistingMenuCard({
  menu,
  onDelete,
  onEdit,
}: ExistingMenuCardProps) {
  const handleDelete = async () => {
    if (confirm(`정말 ${menu.menuName} 메뉴를 삭제하시겠습니까?`)) {
      try {
        await deleteMenu(menu.menuId);
        onDelete?.();
      } catch (error) {
        console.error(error);
        alert("메뉴 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div className="p-4 border border-light-gray rounded-md bg-ghost-white relative">
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          onClick={() => onEdit?.(menu)}
          className="p-2 text-sepia hover:text-deep-brown transition-colors"
          title="메뉴 수정"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-sepia hover:text-red transition-colors"
          title="메뉴 삭제"
        >
          <Trash2 size={18} />
        </button>
      </div>
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
