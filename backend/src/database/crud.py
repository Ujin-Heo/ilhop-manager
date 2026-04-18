from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from .models import Table, Customer, Menu, Order, OrderItem
from ..schemas.rest_schemas import TableCreateRequest


# SQLAlchemy로 SELECT문 표현하기
# def get_board_by_name(db: Session, name: str) -> Board | None:
#     stmt = select(Board).where(Board.name == name)
#     return db.scalars(stmt).first()


# ========= Table 관련 로직 ===========================================


async def get_tables_from_db(db: AsyncSession) -> list[Table]:
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


async def add_new_table_to_db(
    db: AsyncSession, request_data: TableCreateRequest
) -> Table:
    # 1. Pydantic 모델을 DB Model(Entity)로 변환
    # model_dump()를 사용해 dict로 만든 뒤 언패킹(**)하여 전달합니다.
    new_table = Table(**request_data.model_dump())

    # 2. DB에 추가
    db.add(new_table)

    # 3. 비동기 환경에서는 반드시 await flush() 또는 commit()을 해야 합니다.
    # commit()을 하면 DB에서 정의한 DEFAULT 값(UUID)이 생성됩니다.
    await db.commit()

    # 4. 중요: refresh를 호출해야 DB에서 자동으로 생성된 table_id(UUID)를
    # 파이썬 객체(new_table)가 다시 읽어와서 response_model에 담길 수 있습니다.
    await db.refresh(new_table)

    return new_table
