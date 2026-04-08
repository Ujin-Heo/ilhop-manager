from fastapi import APIRouter, Depends, HTTPException, WebSocket
from sqlalchemy.orm import Session

from ..database.models import get_db
from ..database.db import initialize_boards, get_board_by_name

router = APIRouter()


@router.get("/init")
async def initialize(db: Session = Depends(get_db)):
    try:
        initialize_boards(db)

        return {"message": "[서버 메시지] DB를 성공적으로 초기화했습니다."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"[⚠️ 서버 오류] {str(e)}")


@router.get("/find_board/{board_name}")  # path parameter 사용
async def find_board(board_name: str, db: Session = Depends(get_db)):
    try:
        board = get_board_by_name(db, board_name)

        return {"게시판 제목": f"{board.name}", "게시판 링크": f"{board.link}"}

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
