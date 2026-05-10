import { useState } from "react";
import { MenuCreateRequest } from "@/lib/definitions";
import { createMenu } from "@/lib/api/menus";

interface NewMenuFormProps {
  onSuccess: () => void;
}

export default function NewMenuForm({ onSuccess }: NewMenuFormProps) {
  const [newMenu, setNewMenu] = useState<MenuCreateRequest>({
    menuName: "",
    section: "",
    price: 0,
    options: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenu.section) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    try {
      await createMenu(newMenu);
      setNewMenu({ menuName: "", section: "", price: 0, options: [] });
      onSuccess();
    } catch (err) {
      alert(err instanceof Error ? err.message : "메뉴 추가에 실패했습니다.");
    }
  };

  return (
    <div className="border-t border-light-gray pt-8">
      <h3 className="text-xl font-semibold mb-6 text-deep-brown">
        새 메뉴 추가
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-sepia">메뉴 이름</label>
            <input
              type="text"
              required
              value={newMenu.menuName}
              onChange={(e) =>
                setNewMenu({ ...newMenu, menuName: e.target.value })
              }
              className="p-2 border border-light-gray rounded focus:outline-none focus:border-cinnamon text-black"
              placeholder="예: 소주"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-sepia">
              카테고리 (Section)
            </label>
            <div className="flex gap-4 p-2">
              <label className="flex items-center gap-2 text-black cursor-pointer">
                <input
                  type="radio"
                  name="section"
                  value="안주류"
                  required
                  checked={newMenu.section === "안주류"}
                  onChange={(e) =>
                    setNewMenu({ ...newMenu, section: e.target.value })
                  }
                  className="accent-cinnamon"
                />
                안주류
              </label>
              <label className="flex items-center gap-2 text-black cursor-pointer">
                <input
                  type="radio"
                  name="section"
                  value="주류"
                  required
                  checked={newMenu.section === "주류"}
                  onChange={(e) =>
                    setNewMenu({ ...newMenu, section: e.target.value })
                  }
                  className="accent-cinnamon"
                />
                주류
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-sepia">가격</label>
            <input
              type="number"
              required
              min="0"
              value={newMenu.price}
              onChange={(e) =>
                setNewMenu({
                  ...newMenu,
                  price: parseInt(e.target.value) || 0,
                })
              }
              className="p-2 border border-light-gray rounded focus:outline-none focus:border-cinnamon text-black"
              placeholder="예: 5000"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-sepia">
              옵션 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={newMenu.options?.join(", ") || ""}
              onChange={(e) =>
                setNewMenu({
                  ...newMenu,
                  options: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="p-2 border border-light-gray rounded focus:outline-none focus:border-cinnamon text-black"
              placeholder="예: 참이슬, 좋은데이"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-2 bg-cinnamon text-white font-bold rounded hover:opacity-90 transition-opacity cursor-pointer"
        >
          메뉴 등록하기
        </button>
      </form>
    </div>
  );
}
