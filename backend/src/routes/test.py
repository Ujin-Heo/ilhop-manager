from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import get_db
from ..database.db import initialize_data

router = APIRouter()


@router.get("/init")
async def initialize(db: AsyncSession = Depends(get_db)):
    try:
        await initialize_data(db)

        return {"message": "[서버 메시지] DB를 성공적으로 초기화했습니다."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"[⚠️ 서버 오류] {str(e)}")


# ========= Post/PUT request 사용하기 =============================================
from pydantic import BaseModel


# request의 body안의 json이 아래와 같은 형태여야 한다.
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


@router.post("/items/")
async def create_item(item: Item):
    item_dict = item.model_dump()  # Item 인스턴스를 딕셔너리로 변환
    if item.tax:
        price_with_tax = item.price + item.tax
        item_dict.update({"price_with_tax": price_with_tax})
    return item_dict


# query parameter 사용하기 (url에서 ? 뒤에 넣음)
@router.put("/items/{item_id}")
async def create_item(item_id: int, item: Item, q: str | None = None):
    result = {"item_id": item_id, **item.model_dump()}
    if q:
        result.update({"q": q})
    return result  # 실제로는 DB 수정 로직 작성
