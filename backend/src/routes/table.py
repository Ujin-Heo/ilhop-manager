from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import get_db, Table
from ..database.crud import (
    get_tables_from_db,
    add_new_table_to_db,
    update_table_in_db,
    delete_table_from_db,
)
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


@router.patch(
    "/tables/{table_id}",
    operation_id="update_table",
    response_model=TableStatus,  # Response Body (Pydantic)
    status_code=status.HTTP_200_OK,
    tags=["table"],
    summary="테이블 정보 수정",
)
async def update_table(
    table_id: str,  # Path Parameter
    request_data: TableUpdateRequest,  # Request Body (Pydantic)
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    특정 테이블의 번호(`tableNum`)를 변경하거나,
    테이블 파손 등의 사유로 이용 가능 여부(`isAvailable`)를 업데이트할 때 사용합니다.
    """
    try:
        updated_table: Table = await update_table_in_db(db, table_id, request_data)
        return updated_table

    except IntegrityError as ie:
        # DB 제약 조건 위반 (중복 번호) 시 발생
        await db.rollback()  # 에러 발생 시 세션을 되돌립니다.
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"[❌ 데이터 충돌] 이미 해당 번호의 테이블이 있습니다. {str(ie)}",
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"[❌ 해당 테이블을 찾을 수 없음] {str(ve)}",
        )
    except Exception as e:  # 서버 내부 에러
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"[⚠️ 서버 오류] {str(e)}",
        )


@router.delete(
    "/tables/{table_id}",
    operation_id="delete_table",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["table"],
    summary="특정 테이블 삭제",
)
async def delete_table(
    table_id: str,  # Path Parameter
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    지정한 UUID를 가진 테이블을 시스템에서 삭제합니다.
    단, 해당 테이블에 아직 `isActive: true`인 손님이 있거나 결제되지 않은 주문이 연결되어 있을 경우
    데이터 무결성을 위해 삭제가 제한될 수 있습니다.
    """
    try:
        await delete_table_from_db(db, table_id)

        # 삭제 성공 시 반환할 콘텐츠 없음 (HTTP Code 204)

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="[❌ 삭제 제한] 연결된 고객이나 주문 데이터가 있어 삭제할 수 없습니다. 이용 현황을 먼저 정리해 주세요.",
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"[❌ 해당 테이블을 찾을 수 없음] {str(ve)}",
        )
    except Exception as e:  # 서버 내부 에러
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"[⚠️ 서버 오류] {str(e)}",
        )
