from __future__ import annotations

from uuid import UUID
from typing import Literal
from pydantic import BaseModel, Field
from .rest_schemas import OrderDetail

from typing import Annotated


class WSBasePayload(BaseModel):
    """Base class for WebSocket message payloads."""

    event: str


class OrderCreatedPayload(WSBasePayload):
    event: Literal["ORDER_CREATED"] = "ORDER_CREATED"
    data: OrderDetail


class ItemServedUpdatedData(BaseModel):
    orderId: Annotated[UUID, Field(description="대상 주문의 UUID")]
    menuName: Annotated[str, Field(description="대상 메뉴 이름")]
    isServed: Annotated[bool, Field(description="서빙 완료 여부")]


class ItemServedUpdatedPayload(WSBasePayload):
    event: Literal["ITEM_SERVED_UPDATED"] = "ITEM_SERVED_UPDATED"
    data: ItemServedUpdatedData


class PaymentConfirmedData(BaseModel):
    orderId: Annotated[UUID, Field(description="결제 완료된 주문의 UUID")]
    isPaid: Annotated[bool, Field(description="입금 확인 여부")]


class PaymentConfirmedPayload(WSBasePayload):
    event: Literal["PAYMENT_CONFIRMED"] = "PAYMENT_CONFIRMED"
    data: PaymentConfirmedData


# Summary of all possible messages for type hinting
WSMessage = OrderCreatedPayload | ItemServedUpdatedPayload | PaymentConfirmedPayload


# AsyncAPI Document Models (Simplified and refined)
class Info(BaseModel):
    title: str
    version: str
    description: str


class ChannelReference(BaseModel):
    ref: Annotated[str, Field(alias="$ref")]


class Operation(BaseModel):
    action: Literal["send", "receive"]
    channel: ChannelReference


class AsyncAPIDocument(BaseModel):
    asyncapi: str = "3.0.0"
    info: Info
    channels: dict[str, dict]
    operations: dict[str, Operation]
    components: dict[str, dict]
