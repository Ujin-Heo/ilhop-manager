import { BASE_URL } from './config';
import {
  OrderDetail,
  OrderCreateRequest,
  OrderCreateResponse,
  OrderPaymentUpdateRequest,
  OrderPaymentUpdateResponse,
  OrderMemoUpdateRequest,
  OrderMemoUpdateResponse,
} from '../definitions';

/**
 * 전체 주문 내역 리스트 조회 (관리자용)
 */
export async function getOrders(isPaid?: boolean): Promise<OrderDetail[]> {
  const params = new URLSearchParams();
  if (isPaid !== undefined) params.append('isPaid', isPaid.toString());

  const response = await fetch(`${BASE_URL}/orders?${params.toString()}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '주문 내역을 가져오는 데 실패했습니다.');
  }

  return response.json();
}

/**
 * 새 주문 생성 (장바구니 결제)
 */
export async function createOrder(
  data: OrderCreateRequest
): Promise<OrderCreateResponse> {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '주문 생성에 실패했습니다.');
  }

  return response.json();
}

/**
 * 주문 결제 상태 수동 업데이트
 */
export async function updateOrderIsPaid(
  orderId: string,
  data: OrderPaymentUpdateRequest
): Promise<OrderPaymentUpdateResponse> {
  const response = await fetch(`${BASE_URL}/orders/${orderId}/payment`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '결제 상태 업데이트에 실패했습니다.');
  }

  return response.json();
}

/**
 * 주문 비고(메모) 업데이트
 */
export async function updateOrderMemo(
  orderId: string,
  data: OrderMemoUpdateRequest,
  options?: RequestInit
): Promise<OrderMemoUpdateResponse> {
  const response = await fetch(`${BASE_URL}/orders/${orderId}/memo`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '메모 업데이트에 실패했습니다.');
  }

  return response.json();
}
