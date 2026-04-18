from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import get_db
from ..database.crud import add_record_to_db
from ..schemas.rest_schemas import (
    ExampleRequestBody,
    ExampleResponseBody,
)

router = APIRouter()


@router.post(
    "/template/{path_parameter}",
    operation_id="template_endpoint",
    response_model=ExampleResponseBody,  # Response Body (Pydantic)
    status_code=status.HTTP_201_CREATED,
    tags=["Menu"],
    summary="엔드포인트 요약 설명",
)
async def template_endpoint(
    path_parameter: str,  # Path Parameter
    request_data: ExampleRequestBody,  # Request Body (Pydantic)
    query_parameter: str | None = None,  # Query Parameter
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    엔드포인트에 대한 상세 설명 (Swagger UI에 노출)
    """
    try:
        # 1. 데이터 가공 (Dict 변환)
        record_data = request_data.model_dump()
        record_data.update({"id": path_parameter, "extra": query_parameter})

        # 2. 비즈니스 로직 및 DB 작업 (CRUD 작업을 위한 함수들을 호출하기)
        new_record = await add_record_to_db(db, record_data)

        # 3. 결과 반환 (FastAPI가 ExampleResponseBody 형식으로 자동 변환)
        return new_record

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
