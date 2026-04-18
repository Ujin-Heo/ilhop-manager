from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import get_db, Table
from ..database.crud import get_tables_from_db, add_new_table_to_db
from ..schemas.rest_schemas import TableStatus, TableCreateRequest, TableUpdateRequest

router = APIRouter()


@router.get(
    "/tables",
    operation_id="get_tables",
    response_model=list[TableStatus],  # Response Body (Pydantic)
    status_code=status.HTTP_200_OK,
    tags=["table"],
    summary="전체 Table 및 현재 이용 현황 조회",
)
async def get_tables(
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    모든 테이블의 위치(grid) 정보와 이용 가능 여부를 반환합니다.
    만약 테이블에 활성화된(isActive=true) 손님이 있다면 해당 손님의 정보(입장 시각 등)를 포함합니다.
    """
    try:
        # 비즈니스 로직 및 CRUD 작업
        # DB에서 테이블 정보 읽어오기
        tables: list[Table] = await get_tables_from_db(db)

        # 결과 반환
        # Pydantic이 list[TableStatus] 형식으로 자동 변환
        return tables

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
    "/tables",
    operation_id="create_table",
    response_model=TableStatus,  # Response Body (Pydantic)
    status_code=status.HTTP_201_CREATED,
    tags=["table"],
    summary="새로운 테이블 추가 또는 배치 설정",
)
async def create_table(
    request_data: TableCreateRequest,  # Request Body (Pydantic)
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    매장에 새로운 테이블을 추가하거나 그리드 상의 위치를 지정합니다.
    백엔드에서는 `table_id`를 UUID로 자동 생성하며, 동일한 `gridRow`, `gridCol` 위치에 중복된 테이블이 오지 않도록 검증합니다.
    """
    try:
        new_table: Table = await add_new_table_to_db(db, request_data)
        return new_table

    except IntegrityError as ie:
        # DB 제약 조건 위반 (중복 번호, 중복 좌표 등) 시 발생
        await db.rollback()  # 에러 발생 시 세션을 되돌립니다.
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"[❌ 데이터 충돌] 이미 해당 번호의 테이블이 있거나, 지정한 위치에 다른 테이블이 존재합니다. {str(ie)}",
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
