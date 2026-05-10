from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import crud
from ..database.models import get_db
from ..schemas.rest_schemas import MetaDataResponse, MetaDataUpdateRequest

router = APIRouter(prefix="/metadata", tags=["metadata"])

@router.get("", response_model=MetaDataResponse)
async def get_metadata(db: AsyncSession = Depends(get_db)):
    """
    매장의 기본 설정(계좌 번호, 테이블 레이아웃 등)을 가져옵니다.
    """
    return await crud.get_metadata_from_db(db)

@router.patch("", response_model=MetaDataResponse)
async def update_metadata(
    request: MetaDataUpdateRequest, 
    db: AsyncSession = Depends(get_db)
):
    """
    매장의 기본 설정 정보를 업데이트합니다.
    """
    return await crud.update_metadata_in_db(db, request)
