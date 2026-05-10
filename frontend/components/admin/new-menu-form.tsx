import { useState, useEffect } from "react";
import { MenuResponse, MenuUpdateRequest } from "@/lib/definitions";
import { createMenu, updateMenu } from "@/lib/api/menus";

interface NewMenuFormProps {
  onSuccess: () => void;
  editMenu?: MenuResponse | null;
  onCancelEdit?: () => void;
}

export default function NewMenuForm({
  onSuccess,
  editMenu,
  onCancelEdit,
}: NewMenuFormProps) {
  const [formData, setFormData] = useState<MenuUpdateRequest>({
    menuName: "",
    section: "",
    price: 0,
    options: [],
  });

  const [optionsInput, setOptionsInput] = useState("");

  useEffect(() => {
    const initialOptions = editMenu ? editMenu.options?.join(", ") : "";
    setOptionsInput(initialOptions || "");
  }, [editMenu]);

  useEffect(() => {
    if (editMenu) {
      setFormData({
        menuName: editMenu.menuName,
        section: editMenu.section,
        price: editMenu.price,
        options: editMenu.options || [],
      });
    } else {
      setFormData({
        menuName: "",
        section: "",
        price: 0,
        options: [],
      });
    }
  }, [editMenu]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.section) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    try {
      if (editMenu) {
        await updateMenu(editMenu.menuId, formData);
        onCancelEdit?.();
      } else {
        await createMenu(formData as any);
        setFormData({ menuName: "", section: "", price: 0, options: [] });
      }
      onSuccess();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : `메뉴 ${editMenu ? "수정" : "추가"}에 실패했습니다.`,
      );
    }
  };

  return (
    <div className="border-t border-light-gray pt-8">
      <h3 className="text-xl font-semibold mb-6 text-deep-brown">
        {editMenu ? `${editMenu.menuName} 메뉴 수정` : "새 메뉴 추가"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-sepia">메뉴 이름</label>
            <input
              type="text"
              required
              value={formData.menuName}
              onChange={(e) =>
                setFormData({ ...formData, menuName: e.target.value })
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
                  checked={formData.section === "안주류"}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
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
                  checked={formData.section === "주류"}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
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
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
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
              value={optionsInput}
              onChange={(e) => {
                const val = e.target.value;
                setOptionsInput(val);
                setFormData({
                  ...formData,
                  options: val
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                });
              }}
              className="p-2 border border-light-gray rounded focus:outline-none focus:border-cinnamon text-black"
              placeholder="예: 참이슬, 좋은데이"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-6 py-2 bg-cinnamon text-white font-bold rounded hover:opacity-90 transition-opacity cursor-pointer"
          >
            {editMenu ? "메뉴 수정하기" : "메뉴 등록하기"}
          </button>
          {editMenu && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-6 py-2 border border-light-gray text-sepia font-bold rounded hover:bg-pale-gray transition-colors cursor-pointer"
            >
              취소
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
