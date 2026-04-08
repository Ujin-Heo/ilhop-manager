from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from .models import Customer, Menu, Order, OrderItem

# Business logic related to the new models will go here.


async def initialize_data(db: AsyncSession):
    # Example: Clear data (be careful in production)
    await db.execute(delete(OrderItem))
    await db.execute(delete(Order))
    await db.execute(delete(Menu))
    await db.execute(delete(Customer))
    await db.commit()


# SQLAlchemy로 SELECT문 표현하기
# def get_board_by_name(db: Session, name: str) -> Board | None:
#     stmt = select(Board).where(Board.name == name)
#     return db.scalars(stmt).first()
