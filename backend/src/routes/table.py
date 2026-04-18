from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import get_db, Table
from ..database.crud import get_table_status
from ..schemas.rest_schemas import TableStatus, TableCreateRequest, TableUpdateRequest

router = APIRouter()


@router.get(
    "/tables",
    operation_id="get_tables",
    response_model=list[TableStatus],  # Response Body (Pydantic)
    status_code=status.HTTP_200_OK,
    tags=["table"],
    summary="전체 테이블 및 현재 이용 현황 조회",
)
async def get_tables(
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    모든 테이블의 위치(grid) 정보와 이용 가능 여부를 반환합니다.
    만약 테이블에 활성화된(isActive=true) 손님이 있다면 해당 손님의 정보(입장 시각 등)를 포함합니다.
    """
    try:
        # DB에서 테이블 정보 읽어오기
        table_status: list[Table] = await get_table_status(db)

        # 결과 반환 (FastAPI가 ExampleResponseBody 형식으로 자동 변환)
        return table_status

    except ValueError as ve:  # 비즈니스 로직 상의 에러 (예: 중복 데이터)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"[❌ 잘못된 요청] {str(ve)}",
        )
    except Exception as e:  # 서버 내부 에러
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"[⚠️ 서버 오류] {str(e)}",
        )
