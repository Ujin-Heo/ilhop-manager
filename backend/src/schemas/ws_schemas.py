from pydantic import BaseModel
from typing import Literal

from .rest_schemas import (
    OrderDetail,
    OrderPaymentUpdateResponse,
    OrderItemServedUpdateResponse,
)


class OrderCreatedMessage(BaseModel):
    event: Literal["ORDER_CREATED"] = "ORDER_CREATED"
    data: OrderDetail


class PaymentConfirmedMessage(BaseModel):
    event: Literal["PAYMENT_CONFIRMED"] = "PAYMENT_CONFIRMED"
    data: OrderPaymentUpdateResponse


class ItemServedUpdated(BaseModel):
    event: Literal["ITEM_SERVED_UPDATED"] = "ITEM_SERVED_UPDATED"
    data: OrderItemServedUpdateResponse
