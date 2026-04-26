from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.exc import IntegrityError, MultipleResultsFound, NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import get_db, Customer
from ..database.crud import (
    get_customers_from_db,
    add_new_customer_to_db,
    update_customer_active_status_in_db,
    get_customer_order_summary_from_db,
)
from ..schemas.rest_schemas import (
    CustomerBrief,
    CustomerCreateRequest,
    OrderSummaryResponse,
)

from typing import Annotated

router = APIRouter()


@router.get(
    "/customers",
    operation_id="get_customers",
    response_model=CustomerBrief,  # Response Body (Pydantic)
    status_code=status.HTTP_200_OK,
    tags=["customer"],
    summary="조건에 맞는 고객 목록 조회",
)
async def get_customers(
    table_num: Annotated[int | None, Query(alias="tableNum")] = None,
    is_active: Annotated[bool | None, Query(alias="isActive")] = None,
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    테이블 번호나 활성화 여부 등의 조건을 필터로 사용하여 고객 정보를 조회합니다.
    주문 웹페이지 접속 시 `tableNum={n}&active=true` 파라미터를 사용하여
    현재 해당 테이블을 이용 중인 고객 1명의 정보를 가져오는 데 주로 사용됩니다.
    """
    try:
        customers: list[Customer] = await get_customers_from_db(
            db, table_num, is_active
        )

        return customers

    except MultipleResultsFound as mrfe:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"[❌ 여러 개의 손님 데이터가 반환됨] {str(mrfe)}",
        )
    except NoResultFound as nrfe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"[❌ 해당 데이터를 찾을 수 없음] {str(nrfe)}",
        )
    except Exception as e:  # 서버 내부 에러
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"[⚠️ 서버 오류] {str(e)}",
        )


@router.post(
    "/customers",
    operation_id="create_customer",
    response_model=CustomerBrief,  # Response Body (Pydantic)
    status_code=status.HTTP_201_CREATED,
    tags=["customer"],
    summary="새 손님 입장(테이블 점유)",
)
async def create_customer(
    request_data: CustomerCreateRequest,  # Request Body (Pydantic)
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    특정 테이블에 새로운 손님 세션을 생성합니다.\n
    백엔드에서 해당 테이블의 table_id를 조회하고, 현재 시각을 entry_time으로 설정하여\n
    isActive: true 상태의 고객 레코드를 생성합니다.
    """
    try:
        new_customer: Customer = await add_new_customer_to_db(db, request_data)
        return new_customer

    except NoResultFound as nrfe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"[❌ 헤당 데이터를 찾을 수 없음] {str(nrfe)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"[⚠️ 서버 오류] {str(e)}",
        )


@router.patch(
    "/customers/{customer_id}",
    operation_id="update_customer_active_status",
    response_model=CustomerBrief,
    status_code=status.HTTP_200_OK,
    tags=["customer"],
    summary="특정 고객을 퇴장 처리함",
)
async def update_customer_active_status(
    customer_id: str,
    is_active: Annotated[bool, Query(alias="isActive")],
    db: AsyncSession = Depends(get_db),
):
    """
    특정 고객 ID를 사용하여 해당 고객이 퇴장하고 난 후 `isActive`를 `false`로 만듦.
    """
    try:
        updated_customer: Customer = await update_customer_active_status_in_db(
            db, customer_id, is_active
        )
        return updated_customer

    except NoResultFound as nrfe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"[❌ 헤당 데이터를 찾을 수 없음] {str(nrfe)}",
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


@router.get(
    "/customers/{customer_id}/order-summary",
    operation_id="get_customer_order_summary",
    response_model=OrderSummaryResponse,  # Response Body (Pydantic)
    status_code=status.HTTP_200_OK,
    tags=["customer"],
    summary="특정 고객의 결제 완료 주문 내역 조회",
)
async def get_customer_order_summary(
    customer_id: str,  # Path Parameter
    is_paid: Annotated[bool | None, Query(alias="isPaid")] = None,
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    특정 고객 ID를 필터로 사용하여 해당 고객이 주문한 내역 중 결제 승인(`isPaid=true`)이 완료된 항목들만 가져옵니다.\n
    동일한 메뉴에 대한 주문 내역은 수량을 합산하여 하나로 묶어서 가져옵니다.\n
    주문 페이지의 '주문 내역' 탭에서 사용됩니다.
    """
    try:

        order_summary: OrderSummaryResponse = await get_customer_order_summary_from_db(
            db, customer_id, is_paid
        )
        return order_summary

    except NoResultFound as nrfe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"[❌ 헤당 데이터를 찾을 수 없음] {str(nrfe)}",
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
