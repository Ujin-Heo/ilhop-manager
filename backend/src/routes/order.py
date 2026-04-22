from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import get_db, Order
from ..database.crud import get_orders_from_db, add_new_order_to_db
from ..schemas.rest_schemas import OrderDetail, OrderCreateRequest

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
    response_model=OrderDetail,  # Response Body (Pydantic)
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
    백엔드는 `orders` 테이블에 기본 정보를 저장하고, 상세 메뉴들을 `order_items`에 기록합니다.
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
