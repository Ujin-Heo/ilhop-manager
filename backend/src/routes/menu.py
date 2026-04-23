from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import get_db, Menu
from ..database.crud import (
    get_menus_from_db,
    add_new_menu_to_db,
)
from ..schemas.rest_schemas import MenuResponse, MenuCreateRequest

router = APIRouter()


@router.get(
    "/menus",
    operation_id="get_menus",
    response_model=list[MenuResponse],  # Response Body (Pydantic)
    status_code=status.HTTP_200_OK,
    tags=["menu"],
    summary="전체 Menu 목록 조회",
)
async def get_menus(
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    주문 페이지 접속 시 노출할 전체 메뉴 목록을 가져옵니다.\n
    각 메뉴의 가격, 이미지 URL, 선택 가능한 옵션 리스트를 포함합니다.
    """
    try:
        menus: list[Menu] = await get_menus_from_db(db)
        return menus

    except Exception as e:  # 서버 내부 에러
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"[⚠️ 서버 오류] {str(e)}",
        )


@router.post(
    "/menus",
    operation_id="create_menu",
    response_model=Menu,  # Response Body (Pydantic)
    status_code=status.HTTP_201_CREATED,
    tags=["menu"],
    summary="새로운 메뉴 추가",
)
async def create_menu(
    request_data: MenuCreateRequest,  # Request Body (Pydantic)
    db: AsyncSession = Depends(get_db),  # DB Session Injection
):
    """
    메뉴판에 새로운 메뉴를 추가합니다. 백엔드에서는 `menu_id`를 UUID로 자동 생성합니다.
    """
    try:
        new_menu: Menu = await add_new_menu_to_db(db, request_data)
        return new_menu

    except IntegrityError as ie:
        # DB 제약 조건 위반 (중복 데이터 등) 시 발생
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"[❌ 데이터 충돌] 이미 같은 이름의 메뉴가 존재합니다. {str(ie)}",
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
