from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        # 1. 관리자용: 모든 실시간 이벤트를 받는 연결 리스트
        self.admin_connections: list[WebSocket] = []
        # 2. 손님용: orderId별로 특정 손님의 연결을 저장 (Key: orderId, Value: WebSocket)
        self.customer_connections: dict[str, WebSocket] = {}

    async def connect_admin(self, websocket: WebSocket):
        await websocket.accept()
        self.admin_connections.append(websocket)

    def disconnect_admin(self, websocket: WebSocket):
        self.admin_connections.remove(websocket)

    async def connect_customer(self, websocket: WebSocket, order_id: str):
        await websocket.accept()
        self.customer_connections[order_id] = websocket

    def disconnect_customer(self, order_id: str):
        if order_id in self.customer_connections:
            del self.customer_connections[order_id]

    # 관리자들에게 새 주문/서빙 상태 등 알림 전송
    async def broadcast_to_admins(self, message: dict):
        for connection in self.admin_connections:
            await connection.send_json(message)

    # 특정 주문을 한 손님에게만 입금 확인 알림 전송
    async def send_to_customer(self, order_id: str, message: dict):
        if order_id in self.customer_connections:
            await self.customer_connections[order_id].send_json(message)


manager = ConnectionManager()
