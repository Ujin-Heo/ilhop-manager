from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..modules.websocket_manager import manager

router = APIRouter()


# [채널 1] 관리자용 실시간 이벤트 수신 (/ws/orders)
@router.websocket("/ws/orders")
async def websocket_order_events(websocket: WebSocket):
    await manager.connect_admin(websocket)
    try:
        while True:
            # 새 주문 생성, 입금 확인, 서빙 완료 등의 메시지를 기다림
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_admin(websocket)


# [채널 2] 손님용 입금 확인 수신 (/ws/payment-status/{orderId})
@router.websocket("/ws/payment-status/{orderId}")
async def websocket_payment_status(websocket: WebSocket, orderId: str):
    await manager.connect_customer(websocket, orderId)
    try:
        while True:
            # 입금 확인 메시지를 기다림
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_customer(orderId)
