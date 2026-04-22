from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.exc import IntegrityError, MultipleResultsFound, NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import get_db, Customer
from ..database.crud import get_customers_from_db
from ..schemas.rest_schemas import CustomerBrief, CustomerCreateRequest

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
