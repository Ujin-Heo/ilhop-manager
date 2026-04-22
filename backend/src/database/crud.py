from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from .models import Table, Customer, Menu, Order, OrderItem
from ..schemas.rest_schemas import TableCreateRequest, TableUpdateRequest


# ========= Table 관련 로직 ===========================================


async def get_tables_from_db(db: AsyncSession) -> list[Table]:
    """
    DB에 저장된 모든 Table을 가지고 와서 ORM 객체의 리스트로 반환합니다.\n
    각 Table에 딸린 Customer 중 is_active == True인 것만 골라서 함께 가져옵니다.
    """
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
    """
    request_data를 바탕으로 새로운 Table 객체를 만들어 DB에 삽입합니다.\n
    새로 생성한 Table 객체를 반환합니다.
    """
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


async def update_table_in_db(
    db: AsyncSession, table_id: str, request_data: TableUpdateRequest
) -> Table:
    """
    DB에서 table_id를 가진 Table을 찾아서 request_data 안의 정보로 업데이트합니다.
    """
    # 1. DB에서 request_data의 table_id를 가진 Table을 찾기
    # stmt = select(Table).where(Table.table_id == table_id)
    # result = await db.execute(stmt)
    # table_to_update: Table = result.scalar_one_or_none()

    # 위의 세 줄보다 db.get() 사용하는 게 더 효율적임
    table_to_update = await db.get(Table, table_id)

    if not table_to_update:
        raise ValueError(f"ID가 {table_id}인 테이블을 찾을 수 없습니다.")

    # 2. requst_data 안의 정보로 선택한 Table을 업데이트하기
    update_data = request_data.model_dump(exclude_unset=True)  # None인 field는 제외함
    for key, value in update_data.items():
        setattr(table_to_update, key, value)

    # 3. 수정 내용 반영
    await db.commit()
    await db.refresh(table_to_update)

    return table_to_update


async def delete_table_from_db(db: AsyncSession, table_id: str) -> None:
    """
    DB에서 table_id를 가진 Table을 삭제합니다.
    """
    # 1. DB에서 request_data의 table_id를 가진 Table을 찾기
    table_to_delete = await db.get(Table, table_id)

    if not table_to_delete:
        raise ValueError(f"ID가 {table_id}인 테이블을 찾을 수 없습니다.")

    # 2. 선택한 Table 삭제하기
    await db.delete(table_to_delete)

    # 3. 수정 내용 반영
    await db.commit()


# ========= Customer 관련 로직 ===========================================


async def get_customers_from_db(
    db: AsyncSession, table_num: int | None, is_active: bool | None
) -> list[Customer]:
    """
    특정 테이블의 활성 고객 1명만 가져옵니다.
    만약 결과가 2개 이상이면 MultipleResultsFound 에러가 발생합니다.
    """
    stmt = select(Customer)

    if table_num is not None:
        stmt = stmt.join(Table).where(Table.table_num == table_num)

    if is_active is not None:
        stmt = stmt.where(Customer.is_active == is_active)

    result = await db.execute(stmt)
    Customers = result.scalars().one_or_none()

    return Customers
