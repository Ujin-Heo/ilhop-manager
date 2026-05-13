"use client";

import { useEffect, useState } from "react";
import { getMenus } from "@/lib/api/menus";
import { getMetadata, updateMetadata } from "@/lib/api/metadata";
import { updateAdminPassword, clearAllData } from "@/lib/api/admin";
import {
  MenuResponse,
  MetaDataResponse,
  MetaDataUpdateRequest,
  AdminPasswordUpdateRequest,
} from "@/lib/definitions";
import ExistingMenuCard from "@/components/admin/existing-menu-card";
import NewMenuForm from "@/components/admin/new-menu-form";

export default function Page() {
  const [menus, setMenus] = useState<MenuResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMenu, setEditMenu] = useState<MenuResponse | null>(null);

  const [metadata, setMetadata] = useState<MetaDataResponse | null>(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [formData, setFormData] = useState<MetaDataUpdateRequest>({});

  const [pwFormData, setPwFormData] = useState<AdminPasswordUpdateRequest>({
    currentPassword: "",
    newPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  const [clearLoading, setClearLoading] = useState(false);

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

  const fetchMetadata = async () => {
    try {
      setMetaLoading(true);
      const data = await getMetadata();
      setMetadata(data);
      setFormData({
        accountNumber: data.accountNumber,
        accountHolder: data.accountHolder,
        maxTableRow: data.maxTableRow,
        maxTableCol: data.maxTableCol,
        standardTime: data.standardTime,
        extraTime: data.extraTime,
      });
    } catch (err) {
      setMetaError(
        err instanceof Error
          ? err.message
          : "기본 설정을 불러오는데 실패했습니다.",
      );
    } finally {
      setMetaLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchMetadata();
  }, []);

  const handleUpdateMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setMetaLoading(true);
      await updateMetadata(formData);
      await fetchMetadata();
      setIsEditingMeta(false);
    } catch (err) {
      setMetaError(
        err instanceof Error ? err.message : "설정 저장에 실패했습니다.",
      );
    } finally {
      setMetaLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    if (pwFormData.newPassword !== confirmPassword) {
      setPwError("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      setPwLoading(true);
      await updateAdminPassword(pwFormData);
      setPwSuccess("비밀번호가 성공적으로 변경되었습니다.");
      setPwFormData({ currentPassword: "", newPassword: "" });
      setConfirmPassword("");
    } catch (err) {
      setPwError(
        err instanceof Error ? err.message : "비밀번호 변경에 실패했습니다.",
      );
    } finally {
      setPwLoading(false);
    }
  };

  const handleClearData = async () => {
    if (
      !confirm(
        "정말 모든 손님 및 주문 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      )
    )
      return;

    try {
      setClearLoading(true);
      await clearAllData();
      alert("모든 데이터가 성공적으로 삭제되었습니다.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "데이터 삭제에 실패했습니다.");
    } finally {
      setClearLoading(false);
    }
  };

  return (
    <main className="bg-warm-beige min-h-screen p-10 flex flex-col items-center gap-10">
      {/* 기본 설정 섹션 */}
      <section className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-sm border border-light-gray">
        <h2 className="text-2xl font-bold mb-6 text-black">기본 설정</h2>

        {metaLoading && !metadata ? (
          <div className="text-sepia">로딩 중...</div>
        ) : metaError ? (
          <div className="text-red mb-4">{metaError}</div>
        ) : (
          <form onSubmit={handleUpdateMetadata} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-deep-brown">
                  입금 은행명 및 계좌 번호
                </label>
                <input
                  type="text"
                  disabled={!isEditingMeta}
                  value={formData.accountNumber || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                  className="p-2 border border-light-gray rounded bg-warm-white text-black disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-deep-brown">
                  예금주
                </label>
                <input
                  type="text"
                  disabled={!isEditingMeta}
                  value={formData.accountHolder || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, accountHolder: e.target.value })
                  }
                  className="p-2 border border-light-gray rounded bg-warm-white text-black disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-deep-brown">
                  최대 테이블 행(Row)
                </label>
                <input
                  type="number"
                  disabled={!isEditingMeta}
                  value={formData.maxTableRow || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxTableRow: parseInt(e.target.value),
                    })
                  }
                  className="p-2 border border-light-gray rounded bg-warm-white text-black disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-deep-brown">
                  최대 테이블 열(Col)
                </label>
                <input
                  type="number"
                  disabled={!isEditingMeta}
                  value={formData.maxTableCol || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxTableCol: parseInt(e.target.value),
                    })
                  }
                  className="p-2 border border-light-gray rounded bg-warm-white text-black disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-deep-brown">
                  기본 이용 시간 (분)
                </label>
                <input
                  type="number"
                  disabled={!isEditingMeta}
                  value={formData.standardTime || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      standardTime: parseInt(e.target.value),
                    })
                  }
                  className="p-2 border border-light-gray rounded bg-warm-white text-black disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-deep-brown">
                  연장 추가 시간 (분)
                </label>
                <input
                  type="number"
                  disabled={!isEditingMeta}
                  value={formData.extraTime || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      extraTime: parseInt(e.target.value),
                    })
                  }
                  className="p-2 border border-light-gray rounded bg-warm-white text-black disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              {!isEditingMeta ? (
                <button
                  type="button"
                  onClick={() => setIsEditingMeta(true)}
                  className="px-6 py-2 bg-deep-brown text-white rounded hover:bg-sepia transition-colors"
                >
                  수정하기
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingMeta(false);
                      setFormData(metadata!);
                    }}
                    className="px-6 py-2 bg-light-gray text-black rounded hover:bg-gray-300 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={metaLoading}
                    className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition-colors disabled:opacity-50"
                  >
                    {metaLoading ? "저장 중..." : "저장하기"}
                  </button>
                </>
              )}
            </div>
          </form>
        )}
      </section>

      {/* 관리자 비밀번호 변경 섹션 */}
      <section className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-sm border border-light-gray">
        <h2 className="text-2xl font-bold mb-6 text-black">
          관리자 비밀번호 변경
        </h2>

        {pwError && <div className="text-red-600 mb-4">{pwError}</div>}
        {pwSuccess && <div className="text-green-600 mb-4">{pwSuccess}</div>}

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-deep-brown">
                현재 비밀번호
              </label>
              <input
                type="password"
                required
                value={pwFormData.currentPassword}
                onChange={(e) =>
                  setPwFormData({
                    ...pwFormData,
                    currentPassword: e.target.value,
                  })
                }
                className="p-2 border border-light-gray rounded bg-warm-white text-black"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-deep-brown">
                새 비밀번호
              </label>
              <input
                type="password"
                required
                value={pwFormData.newPassword}
                onChange={(e) =>
                  setPwFormData({ ...pwFormData, newPassword: e.target.value })
                }
                className="p-2 border border-light-gray rounded bg-warm-white text-black"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-deep-brown">
                비밀번호 확인
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-2 border border-light-gray rounded bg-warm-white text-black"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pwLoading}
              className="px-6 py-2 bg-deep-brown text-white rounded hover:bg-sepia transition-colors disabled:opacity-50"
            >
              {pwLoading ? "변경 중..." : "비밀번호 변경"}
            </button>
          </div>
        </form>
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
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: "smooth",
                    });
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

      {/* 데이터 초기화 섹션 */}
      <section className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-sm border border-red/30 mb-20">
        <h2 className="text-2xl font-bold mb-6 text-red">데이터 초기화</h2>
        <p className="text-sm text-deep-brown mb-6">
          현재 등록된 모든 손님 정보, 주문 내역, 주문 항목 데이터를 삭제합니다.
          테이블 정보와 메뉴 설정은 유지됩니다.
          <br />
          <span className="font-bold text-red">
            주의: 삭제된 데이터는 복구할 수 없습니다.
          </span>
        </p>
        <div className="flex justify-end">
          <button
            onClick={handleClearData}
            disabled={clearLoading}
            className="px-6 py-2 bg-red text-white rounded hover:bg-red/80 transition-colors disabled:opacity-50 font-bold shadow-md active:scale-95"
          >
            {clearLoading ? "삭제 중..." : "손님 및 주문 데이터 삭제"}
          </button>
        </div>
      </section>
    </main>
  );
}
