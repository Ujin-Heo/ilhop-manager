from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import get_db, OrderItem
from ..database.crud import update_order_item_data_in_db
from ..schemas.rest_schemas import (
    OrderItemServedUpdateRequest,
    OrderItemServedUpdateResponse,
)
from ..schemas.ws_schemas import ItemServedUpdatedMessage
from ..modules.websocket_manager import manager

from typing import Annotated

router = APIRouter()


@router.patch(
    "/order-items/{order_id}/{memu_id}",
    operation_id="update_order_item_served_status",
    response_model=OrderItemServedUpdateResponse,  # Response Body (Pydantic)
    status_code=status.HTTP_200_OK,
    tags=["order item"],
    summary="특정 주문 항목의 서빙 상태 업데이트",
)
async def update_order_item_served_status(
    # Path Parameters
    order_id: str,
    menu_id: str,
    request_data: OrderItemServedUpdateRequest,  # Request Body (Pydantic)
    selected_option: Annotated[str | None, Query(alias="selectedOption")] = None,
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    홀서빙 담당자가 특정 메뉴의 서빙을 완료했을 때 호출합니다.\n
    해당 주문 항목(`order_item`)의 `is_served` 상태를 `true`로 변경하여 캐셔와 홀서빙 화면에 실시간으로 반영되도록 합니다.
    """
    try:
        updated_order_item: OrderItem = await update_order_item_data_in_db(
            db, order_id, menu_id, selected_option, request_data
        )

        message = ItemServedUpdatedMessage(
            data=OrderItemServedUpdateResponse(
                order_id=updated_order_item.order_id,
                menu_id=updated_order_item.menu_id,
                selected_option=updated_order_item.selected_option,
                is_served=updated_order_item.is_served,
            )
        )

        await manager.broadcast_to_admins(message.model_dump())

        return updated_order_item

    except NoResultFound as nrfe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"[❌ 해당 주문을 찾을 수 없음] {str(nrfe)}",
        )
    except IntegrityError as ie:
        # DB 제약 조건 위반 시 발생
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
