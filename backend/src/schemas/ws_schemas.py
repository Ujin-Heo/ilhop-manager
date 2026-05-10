from pydantic import BaseModel
from typing import Literal

from .rest_schemas import (
    OrderDetail,
    OrderPaymentUpdateResponse,
    OrderMemoUpdateResponse,
    OrderItemServedUpdateResponse,
)


class OrderCreatedMessage(BaseModel):
    event: Literal["ORDER_CREATED"] = "ORDER_CREATED"
    data: OrderDetail


class PaymentConfirmedMessage(BaseModel):
    event: Literal["PAYMENT_CONFIRMED"] = "PAYMENT_CONFIRMED"
    data: OrderPaymentUpdateResponse


class MemoUpdatedMessage(BaseModel):
    event: Literal["MEMO_UPDATED"] = "MEMO_UPDATED"
    data: OrderMemoUpdateResponse


class ItemServedUpdatedMessage(BaseModel):
    event: Literal["ITEM_SERVED_UPDATED"] = "ITEM_SERVED_UPDATED"
    data: OrderItemServedUpdateResponse
