"use client";

import { useEffect, useState } from "react";
import { getMenus } from "@/lib/api/menus";
import { MenuResponse } from "@/lib/definitions";
import ExistingMenuCard from "@/components/admin/existing-menu-card";
import NewMenuForm from "@/components/admin/new-menu-form";

export default function Page() {
  const [menus, setMenus] = useState<MenuResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMenu, setEditMenu] = useState<MenuResponse | null>(null);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const data = await getMenus();
      setMenus(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "메뉴를 불러오는데 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <main className="bg-warm-beige min-h-screen p-10 flex flex-col items-center gap-10">
      {/* 기본 설정 섹션 */}
      <section className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-sm border border-light-gray">
        <h2 className="text-2xl font-bold mb-6 text-black">기본 설정</h2>
        <div className="text-sepia">기본 설정 내용이 여기에 들어갑니다.</div>
      </section>

      {/* 메뉴 설정 섹션 */}
      <section className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-sm border border-light-gray">
        <h2 className="text-2xl font-bold mb-6 text-black">메뉴 설정</h2>

        {/* 기존 메뉴 목록 */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-deep-brown">
            기존 메뉴 목록
          </h3>
          {loading ? (
            <div className="text-sepia">로딩 중...</div>
          ) : error ? (
            <div className="text-red">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menus.map((menu) => (
                <ExistingMenuCard
                  key={menu.menuId}
                  menu={menu}
                  onDelete={fetchMenus}
                  onEdit={(m) => {
                    setEditMenu(m);
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 새 메뉴 추가 / 수정 폼 */}
        <NewMenuForm
          onSuccess={fetchMenus}
          editMenu={editMenu}
          onCancelEdit={() => setEditMenu(null)}
        />
      </section>
    </main>
  );
}
