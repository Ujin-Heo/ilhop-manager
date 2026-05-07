import { BASE_URL } from './config';
import { MenuResponse, MenuCreateRequest } from '../definitions';

/**
 * 전체 메뉴 목록 조회
 */
export async function getMenus(): Promise<MenuResponse[]> {
  const response = await fetch(`${BASE_URL}/menus`);

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
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '메뉴 추가에 실패했습니다.');
  }

  return response.json();
}
