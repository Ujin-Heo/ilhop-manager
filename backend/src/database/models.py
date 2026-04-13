import os
import uuid
from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    text,
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

# Database connection setup - Per requirements, using Async SQLAlchemy
# For local development, set DATABASE_URL=postgresql+asyncpg://user:password@localhost/dbname
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres",
)

# If Railway provides a URL starting with postgresql://, convert it for asyncpg
if DATABASE_URL.startswith("postgresql://") and "+asyncpg" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


class Base(DeclarativeBase):
    pass


class Table(Base):
    __tablename__ = "tables"
    __table_args__ = (
        UniqueConstraint("grid_row", "grid_col", name="uq_table_grid_pos"),
    )

    table_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("uuid_generate_v4()"),
    )
    table_num: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)
    grid_row: Mapped[int] = mapped_column(Integer, nullable=False)
    grid_col: Mapped[int] = mapped_column(Integer, nullable=False)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationshps
    customers: Mapped[list["Customer"]] = relationship(back_populates="table")


class Customer(Base):
    __tablename__ = "customers"

    customer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("uuid_generate_v4()"),
    )
    table_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("tables.table_id", name="FK_customers_tables"), nullable=False
    )
    entry_time: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP")
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    table: Mapped["Table"] = relationship(back_populates="customers")
    orders: Mapped[list["Order"]] = relationship(back_populates="customer")


class Menu(Base):
    __tablename__ = "menus"

    menu_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("uuid_generate_v4()"),
    )
    menu_name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    price: Mapped[int] = mapped_column(BigInteger, nullable=False)
    image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    options: Mapped[list[str] | None] = mapped_column(ARRAY(Text), nullable=True)

    # Relationship: A menu can be part of many order_items
    order_items: Mapped[list["OrderItem"]] = relationship(back_populates="menu")


class Order(Base):
    __tablename__ = "orders"

    order_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("uuid_generate_v4()"),
    )
    customer_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("customers.customer_id", name="FK_orders_customers"),
        nullable=False,
    )
    order_time: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=text("CURRENT_TIMESTAMP")
    )
    total_price: Mapped[int] = mapped_column(BigInteger, nullable=False)
    depositor: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_paid: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    memo: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Relationships
    customer: Mapped["Customer"] = relationship(back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    order_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("orders.order_id", name="FK_order_items_orders"),
        primary_key=True,
    )
    menu_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("menus.menu_id", name="FK_order_items_menus"),
        primary_key=True,
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    price_at_order: Mapped[int] = mapped_column(BigInteger, nullable=False)
    selected_option: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_served: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    order: Mapped["Order"] = relationship(back_populates="items")
    menu: Mapped["Menu"] = relationship(back_populates="order_items")
