import { BASE_URL } from './config';
import {
  MenuResponse,
  MenuCreateRequest,
  MenuUpdateRequest,
  MenuIndexUpdateRequest,
} from '../definitions';

/**
 * 전체 메뉴 목록 조회
 */
export async function getMenus(): Promise<MenuResponse[]> {
  const response = await fetch(`${BASE_URL}/menus`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '메뉴 목록을 가져오는 데 실패했습니다.');
  }

  return response.json();
}

/**
 * 새로운 메뉴 추가
 */
export async function createMenu(data: MenuCreateRequest): Promise<MenuResponse> {
  const response = await fetch(`${BASE_URL}/menus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '메뉴 추가에 실패했습니다.');
  }

  return response.json();
}

/**
 * 특정 메뉴 삭제
 */
export async function deleteMenu(menuId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/menus/${menuId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '메뉴 삭제에 실패했습니다.');
  }
}

/**
 * 특정 메뉴 수정
 */
export async function updateMenu(
  menuId: string,
  data: MenuUpdateRequest
): Promise<MenuResponse> {
  const response = await fetch(`${BASE_URL}/menus/${menuId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '메뉴 수정에 실패했습니다.');
  }

  return response.json();
}

/**
 * 특정 메뉴의 정렬 순서 수정
 */
export async function updateMenuIndex(
  menuId: string,
  data: MenuIndexUpdateRequest
): Promise<MenuResponse> {
  const response = await fetch(`${BASE_URL}/menus/${menuId}/index`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '정렬 순서 수정에 실패했습니다.');
  }

  return response.json();
}
