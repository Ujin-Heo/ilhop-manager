import { BASE_URL } from './config';
import {
  TableStatus,
  TableCreateRequest,
  TableUpdateRequest,
} from '../definitions';

/**
 * 전체 Table 및 현재 이용 현황 조회
 */
export async function getTables(): Promise<TableStatus[]> {
  const response = await fetch(`${BASE_URL}/tables`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '테이블 현황을 가져오는 데 실패했습니다.');
  }

  return response.json();
}

/**
 * 새로운 테이블 추가 또는 배치 설정
 */
export async function createTable(data: TableCreateRequest): Promise<TableStatus> {
  const response = await fetch(`${BASE_URL}/tables`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '테이블 추가에 실패했습니다.');
  }

  return response.json();
}

/**
 * 테이블 정보 수정
 */
export async function updateTable(
  tableId: string,
  data: TableUpdateRequest
): Promise<TableStatus> {
  const response = await fetch(`${BASE_URL}/tables/${tableId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '테이블 수정에 실패했습니다.');
  }

  return response.json();
}

/**
 * 특정 테이블 삭제
 */
export async function deleteTable(tableId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/tables/${tableId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '테이블 삭제에 실패했습니다.');
  }
}
