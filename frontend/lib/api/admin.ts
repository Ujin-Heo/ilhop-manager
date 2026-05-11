import { AdminLoginRequest, AdminPasswordUpdateRequest } from "@/lib/definitions";
import { BASE_URL } from "./config";

export async function adminLogin(data: AdminLoginRequest) {
  const res = await fetch(`${BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "로그인에 실패했습니다.");
  }

  return res.json();
}

export async function adminLogout() {
  const res = await fetch(`${BASE_URL}/admin/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("로그아웃에 실패했습니다.");
  }

  return res.json();
}

export async function updateAdminPassword(data: AdminPasswordUpdateRequest) {
  const res = await fetch(`${BASE_URL}/admin/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "비밀번호 변경에 실패했습니다.");
  }

  return res.json();
}

export async function checkAdminAuth() {
  const res = await fetch(`${BASE_URL}/admin/check`, {
    credentials: "include",
  });
  return res.ok;
}
