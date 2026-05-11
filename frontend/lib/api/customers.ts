import { BASE_URL } from './config';
import {
  CustomerBrief,
  CustomerCreateRequest,
  OrderSummaryResponse,
} from '../definitions';

/**
 * 조건에 맞는 고객 정보 조회
 * 주로 특정 테이블을 이용 중인 활성 고객 1명을 가져오는 데 사용됩니다.
 */
export async function getCustomers(
  tableNum?: number,
  isActive?: boolean
): Promise<CustomerBrief> {
  const params = new URLSearchParams();
  if (tableNum !== undefined) params.append('tableNum', tableNum.toString());
  if (isActive !== undefined) params.append('isActive', isActive.toString());

  const response = await fetch(`${BASE_URL}/customers?${params.toString()}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '고객 정보를 가져오는 데 실패했습니다.');
  }

  return response.json();
}

/**
 * 새 손님 입장 (테이블 점유)
 */
export async function createCustomer(
  data: CustomerCreateRequest
): Promise<CustomerBrief> {
  const response = await fetch(`${BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '손님 입장에 실패했습니다.');
  }

  return response.json();
}

/**
 * 특정 고객을 퇴장 처리함 (isActive를 false로 변경)
 */
export async function updateCustomerActiveStatus(
  customerId: string,
  isActive: boolean
): Promise<CustomerBrief> {
  const params = new URLSearchParams({ isActive: isActive.toString() });
  const response = await fetch(`${BASE_URL}/customers/${customerId}?${params.toString()}`, {
    method: 'PATCH',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '고객 상태 업데이트에 실패했습니다.');
  }

  return response.json();
}

/**
 * 특정 고객의 주문 내역 요약 조회
 */
export async function getCustomerOrderSummary(
  customerId: string,
  isPaid?: boolean
): Promise<OrderSummaryResponse> {
  const params = new URLSearchParams();
  if (isPaid !== undefined) params.append('isPaid', isPaid.toString());

  const response = await fetch(
    `${BASE_URL}/customers/${customerId}/order-summary?${params.toString()}`,
    {
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || '주문 요약을 가져오는 데 실패했습니다.');
  }

  return response.json();
}
