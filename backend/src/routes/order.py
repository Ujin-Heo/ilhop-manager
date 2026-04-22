from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import get_db, Order
from ..database.crud import (
    get_orders_from_db,
)
from ..schemas.rest_schemas import OrderDetail

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
        orders: list[Order] = await get_orders_from_db(db, is_paid)
        return orders

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
