from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .routes import table, customer, menu, order, order_item, external, websocket, metadata, admin

app = FastAPI()

# CORS 설정: 쿠키 인증을 위해 allow_credentials=True일 경우 allow_origins에 "*"를 사용할 수 없음.
# 기본 로컬 개발 환경용 origin
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# 환경 변수에서 추가 origin 로드 및 정제 (Railway 등 배포 환경용)
env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    # 쉼표로 분리하고 공백 제거, 빈 문자열 제외
    additional_origins = [o.strip() for o in env_origins.split(",") if o.strip()]
    origins.extend(additional_origins)

# allow_origins가 비어있거나 ["*"]인 경우 Credentials를 허용할 수 없으므로 안전하게 처리
allow_all = "*" in origins or not origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else origins,
    allow_credentials=not allow_all, # allow_origins가 "*"이면 credentials는 False여야 함
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(table.router)
app.include_router(customer.router)
app.include_router(menu.router)
app.include_router(order.router)
app.include_router(order_item.router)
app.include_router(external.router)
app.include_router(websocket.router)
app.include_router(metadata.router)
app.include_router(admin.router)
