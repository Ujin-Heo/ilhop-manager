from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .routes import (
    table,
    customer,
    menu,
    order,
    order_item,
    external,
    websocket,
    metadata,
    admin,
)

app = FastAPI()

# CORS 설정: 쿠키 인증을 위해 allow_credentials=True일 경우 allow_origins에 "*"를 사용할 수 없음.
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# 환경 변수에서 추가 origin 로드 (운영 환경 대비)
env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    origins.extend(env_origins.split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
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
