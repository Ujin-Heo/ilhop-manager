from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from .models import Table, Customer, Menu, Order, OrderItem


# SQLAlchemy로 SELECT문 표현하기
# def get_board_by_name(db: Session, name: str) -> Board | None:
#     stmt = select(Board).where(Board.name == name)
#     return db.scalars(stmt).first()


# ========= Table 관련 로직 ===========================================


async def get_table_status(db: AsyncSession) -> list[Table]:
    # 모든 Table을 갖고 옴
    # 각 Table에 딸린 Customer 중 is_active == True인 것만 골라서 함께 가져옴
    stmt = (
        select(Table)
        .options(selectinload(Table.customers.and_(Customer.is_active == True)))
        .order_by(Table.table_num)
    )

    result = await db.execute(stmt)
    tables = result.scalars().all()

    return tables
