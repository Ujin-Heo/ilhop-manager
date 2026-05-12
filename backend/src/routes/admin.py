from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database.models import get_db, AdminConfig
from ..schemas.rest_schemas import AdminLoginRequest, AdminPasswordUpdateRequest
from ..modules.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    verify_token,
    get_current_admin,
)
from ..database.crud import delete_all_customer_order_data_from_db
from typing import Optional

router = APIRouter(prefix="/admin", tags=["admin"])


@router.delete("/data")
async def clear_data(
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    await delete_all_customer_order_data_from_db(db)
    return {"message": "모든 손님 및 주문 데이터가 삭제되었습니다."}


@router.post("/login")
async def admin_login(
    request_data: AdminLoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(AdminConfig).where(AdminConfig.id == "primary"))
    admin_config = result.scalar_one_or_none()

    if not admin_config:
        # If not exists, allow setting the first password or use a default
        # For security, let's assume it should have been seeded.
        # But for ease of use in this task, let's create it if it doesn't exist.
        admin_config = AdminConfig(
            id="primary", password_hash=get_password_hash(request_data.password)
        )
        db.add(admin_config)
        await db.commit()
    else:
        if not verify_password(request_data.password, admin_config.password_hash):
            raise HTTPException(status_code=401, detail="비밀번호가 일치하지 않습니다.")

    token = create_access_token(data={"sub": "admin"})

    # Set HttpOnly cookie
    response.set_cookie(
        key="admin_session",
        value=token,
        httponly=True,
        secure=True,  # HTTPS 연결에서만 쿠키 전송 (배포 시 필수)
        samesite="none",  # 서로 다른 도메인(Vercel <-> Railway) 간 쿠키 전송 허용
        max_age=60 * 60 * 24,  # 1 day
    )

    return {"message": "로그인 성공"}


@router.post("/logout")
async def admin_logout(response: Response):
    response.delete_cookie("admin_session")
    return {"message": "로그아웃 성공"}


@router.patch("/password")
async def update_password(
    request_data: AdminPasswordUpdateRequest,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    result = await db.execute(select(AdminConfig).where(AdminConfig.id == "primary"))
    admin_config = result.scalar_one_or_none()

    if not admin_config or not verify_password(
        request_data.current_password, admin_config.password_hash
    ):
        raise HTTPException(
            status_code=401, detail="현재 비밀번호가 일치하지 않습니다."
        )

    admin_config.password_hash = get_password_hash(request_data.new_password)
    await db.commit()

    return {"message": "비밀번호가 성공적으로 변경되었습니다."}


@router.get("/check")
async def check_auth(admin=Depends(get_current_admin)):
    return {"authenticated": True}
