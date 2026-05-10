from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import get_db, Menu
from ..database.crud import (
    get_menus_from_db,
    add_new_menu_to_db,
    update_menu_in_db,
    update_menu_index_in_db,
    delete_menu_from_db,
)
from ..schemas.rest_schemas import (
    MenuResponse,
    MenuCreateRequest,
    MenuUpdateRequest,
    MenuIndexUpdateRequest,
)

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
    response_model=MenuResponse,  # Response Body (Pydantic)
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


@router.patch(
    "/menus/{menu_id}",
    operation_id="update_menu",
    response_model=MenuResponse,
    status_code=status.HTTP_200_OK,
    tags=["menu"],
    summary="메뉴 정보 수정",
)
async def update_menu(
    menu_id: str,
    request_data: MenuUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    특정 메뉴의 정보를 수정합니다.
    """
    try:
        updated_menu = await update_menu_in_db(db, menu_id, request_data)
        return updated_menu

    except NoResultFound as nrfe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"[❌ 메뉴를 찾을 수 없음] {str(nrfe)}",
        )
    except IntegrityError as ie:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"[❌ 데이터 충돌] {str(ie)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"[⚠️ 서버 오류] {str(e)}",
        )


@router.patch(
    "/menus/{menu_id}/index",
    operation_id="update_menu_index",
    response_model=MenuResponse,
    status_code=status.HTTP_200_OK,
    tags=["menu"],
    summary="메뉴 정렬 순서 수정",
)
async def update_menu_index(
    menu_id: str,
    request_data: MenuIndexUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    특정 메뉴의 정렬 순서(`index`)를 수정합니다.
    새로운 index를 삽입할 때, 해당 index 이상의 기존 항목들을 뒤로 한 칸씩 밀어 충돌을 방지합니다.
    """
    try:
        updated_menu = await update_menu_index_in_db(db, menu_id, request_data.index)
        return updated_menu

    except NoResultFound as nrfe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"[❌ 메뉴를 찾을 수 없음] {str(nrfe)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"[⚠️ 서버 오류] {str(e)}",
        )


@router.delete(
    "/menus/{menu_id}",
    operation_id="delete_menu",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["menu"],
    summary="특정 메뉴 삭제",
)
async def delete_menu(
    menu_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    지정한 UUID를 가진 메뉴를 삭제합니다.\n
    연결된 주문 항목(order_items)의 menu_id는 NULL로 변경됩니다.
    """
    try:
        await delete_menu_from_db(db, menu_id)
        return

    except NoResultFound as nrfe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"[❌ 메뉴를 찾을 수 없음] {str(nrfe)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"[⚠️ 서버 오류] {str(e)}",
        )
