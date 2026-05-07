import { BASE_URL } from './config';
import {
  OrderItemServedUpdateRequest,
  OrderItemServedUpdateResponse,
} from '../definitions';

/**
 * 특정 주문 항목의 서빙 상태 업데이트
 */
export async function updateOrderItemServedStatus(
  orderId: string,
  menuId: string,
  data: OrderItemServedUpdateRequest,
  selectedOption?: string | null
): Promise<OrderItemServedUpdateResponse> {
  const params = new URLSearchParams();
  if (selectedOption !== undefined && selectedOption !== null) {
    params.append('selectedOption', selectedOption);
  }

  const response = await fetch(
    `${BASE_URL}/order-items/${orderId}/${menuId}?${params.toString()}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '서빙 상태 업데이트에 실패했습니다.');
  }

  return response.json();
}
