from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import get_db, Order
from ..database.crud import (
    get_orders_from_db,
    add_new_order_to_db,
    update_order_data_in_db,
)
from ..schemas.rest_schemas import (
    OrderBrief,
    OrderDetail,
    OrderCreateRequest,
    OrderCreateResponse,
    OrderPaymentUpdateRequest,
    OrderMemoUpdateRequest,
)

from typing import Annotated

router = APIRouter()


@router.get(
    "/orders",
    operation_id="get_orders",
    response_model=list[OrderDetail],  # Response Body (Pydantic)
    status_code=status.HTTP_200_OK,
    tags=["order"],
    summary="전체 주문 내역 리스트 조회(관리자용)",
)
async def get_orders(
    is_paid: Annotated[bool | None, Query(alias="isPaid")] = None,
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    시스템의 모든 주문 내역을 개별 건별로 조회합니다.\n
    캐셔가 입금자명과 금액을 대조하여 `isPaid`를 업데이트하기 위한 용도로 사용됩니다.
    """
    try:
        order_details: list[OrderDetail] = await get_orders_from_db(db, is_paid)
        return order_details

    except ValueError as ve:  # 비즈니스 로직 상의 에러 (예: 음수 데이터)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"[❌ 잘못된 요청] {str(ve)}",
        )
    except Exception as e:  # 서버 내부 에러
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"[⚠️ 서버 오류] {str(e)}",
        )


@router.post(
    "/orders",
    operation_id="create_order",
    response_model=OrderCreateResponse,  # Response Body (Pydantic)
    status_code=status.HTTP_201_CREATED,
    tags=["order"],
    summary="새 주문 생성(장바구니 결제)",
)
async def create_order(
    request_data: OrderCreateRequest,  # Request Body (Pydantic)
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    localStorage의 장바구니 데이터를 받아 주문을 생성합니다.\n
    백엔드는 `orders` 테이블에 기본 정보를 저장하고, 상세 메뉴들을 `order_items`에 기록합니다.\n
    장바구니 안에서 같은 `order_id`와 `selected_option`을 가진 항목은 반드시 하나의 `order_item`으로 묶여 있어야 합니다.\n
    즉, 하나의 (`order_id`, `menu_id`, `selected_option`) 조합으로 유일한 `order_item`을 특정할 수 있어야 합니다.
    """

    try:
        new_order: Order = await add_new_order_to_db(db, request_data)
        return new_order

    except IntegrityError as ie:
        # DB 제약 조건 위반 시 발생
        await db.rollback()  # 에러 발생 시 세션을 되돌립니다.
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"[❌ 데이터 조건 불만족] {str(ie)}",
        )
    except ValueError as ve:  # 비즈니스 로직 상의 에러 (예: 음수 데이터)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"[❌ 잘못된 요청] {str(ve)}",
        )
    except Exception as e:  # 서버 내부 에러
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"[⚠️ 서버 오류] {str(e)}",
        )


@router.patch(
    "/orders/{order_id}/payment",
    operation_id="update_order_is_paid",
    response_model=OrderBrief,  # Response Body (Pydantic)
    status_code=status.HTTP_200_OK,
    tags=["order"],
    summary="주문 결제 상태 수동 업데이트",
)
async def update_order_is_paid(
    order_id: str,  # Path Parameter
    request_data: OrderPaymentUpdateRequest,  # Request Body (Pydantic)
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    현금 결제 완료 또는 계좌 이체 수동 확인 시 사용합니다.\n
    해당 주문(`order`)의 `is_paid`를 `true`로 변경합니다.
    """
    try:
        updated_order: Order = await update_order_data_in_db(db, order_id, request_data)
        return updated_order

    except NoResultFound as nrfe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"[❌ 해당 주문을 찾을 수 없음] {str(nrfe)}",
        )
    except IntegrityError as ie:
        # DB 제약 조건 위반 (중복 번호) 시 발생
        await db.rollback()  # 에러 발생 시 세션을 되돌립니다.
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"[❌ 데이터 제약 조건 위반] {str(ie)}",
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"[❌ 잘못된 요청] {str(ve)}",
        )
    except Exception as e:  # 서버 내부 에러
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"[⚠️ 서버 오류] {str(e)}",
        )


@router.patch(
    "/orders/{order_id}/memo",
    operation_id="update_order_memo",
    response_model=OrderBrief,  # Response Body (Pydantic)
    status_code=status.HTTP_200_OK,
    tags=["order"],
    summary="주문 비고(메모) 업데이트",
)
async def update_order_memo(
    order_id: str,  # Path Parameter
    request_data: OrderMemoUpdateRequest,  # Request Body (Pydantic)
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    특정 주문에 대해 관리자(캐셔)가 메모를 작성하거나 수정합니다.\n
    빈 문자열을 보낼 경우 메모가 삭제(또는 초기화)됩니다.
    """
    try:
        updated_order: Order = await update_order_data_in_db(db, order_id, request_data)
        return updated_order

    except NoResultFound as nrfe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"[❌ 해당 주문을 찾을 수 없음] {str(nrfe)}",
        )
    except IntegrityError as ie:
        # DB 제약 조건 위반 (중복 번호) 시 발생
        await db.rollback()  # 에러 발생 시 세션을 되돌립니다.
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"[❌ 데이터 제약 조건 위반] {str(ie)}",
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"[❌ 잘못된 요청] {str(ve)}",
        )
    except Exception as e:  # 서버 내부 에러
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"[⚠️ 서버 오류] {str(e)}",
        )
