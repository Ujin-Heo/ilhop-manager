import { BASE_URL } from './config';
import {
  MetaDataResponse,
  MetaDataUpdateRequest,
} from '../definitions';

/**
 * 매장 기본 설정 조회
 */
export async function getMetadata(): Promise<MetaDataResponse> {
  const response = await fetch(`${BASE_URL}/metadata`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '기본 설정을 가져오는 데 실패했습니다.');
  }

  return response.json();
}

/**
 * 매장 기본 설정 수정
 */
export async function updateMetadata(
  data: MetaDataUpdateRequest
): Promise<MetaDataResponse> {
  const response = await fetch(`${BASE_URL}/metadata`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '기본 설정 수정에 실패했습니다.');
  }

  return response.json();
}
