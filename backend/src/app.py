from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import table, customer, menu, order, order_item, external, websocket

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
