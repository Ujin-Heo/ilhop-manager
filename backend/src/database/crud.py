from sqlalchemy import Row, select, func
from sqlalchemy.exc import MultipleResultsFound, NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload, load_only
from .models import Table, Customer, Menu, Order, OrderItem
from ..schemas.rest_schemas import (
    BaseModel,
    TableCreateRequest,
    TableUpdateRequest,
    CustomerCreateRequest,
    OrderItemSummaryResponse,
    OrderSummaryResponse,
    OrderPaymentUpdateRequest,
    MenuCreateRequest,
    OrderItemBrief,
    OrderDetail,
    OrderCreateRequest,
    PaymentConfirmInfo,
)


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
    # commit()/flush()을 하면 DB에서 정의한 DEFAULT 값(UUID)이 생성됩니다.
    await db.flush()

    # 4. 중요: refresh를 호출해야 DB에서 자동으로 생성된 table_id(UUID)를
    # 파이썬 객체(new_table)가 다시 읽어와서 response_model에 담길 수 있습니다.
    # await db.refresh(new_table) -> selectinload 사용을 위해 쓰지 않고 신 아래의 stmt로 대체함.
    stmt = (
        select(Table)
        .options(selectinload(Table.customers.and_(Customer.is_active == True)))
        .where(Table.table_id == new_table.table_id)
    )
    result = await db.execute(stmt)
    new_table = result.scalar_one()

    await db.commit()

    return new_table


async def update_table_in_db(
    db: AsyncSession, table_id: str, request_data: TableUpdateRequest
) -> Table:
    """
    DB에서 table_id를 가진 Table을 찾아서 request_data 안의 정보로 업데이트합니다.
    """
    # 1. DB에서 request_data의 table_id를 가진 Table을 찾기
    # Primary Key를 사용한 데이터 조회는 db.get()를 사용하는 게 더 효율적이나, selectinload 사용을 위해 아래와 같은 stmt 사용함.
    # table_to_update = await db.get(Table, table_id)
    stmt = (
        select(Table)
        .options(selectinload(Table.customers.and_(Customer.is_active == True)))
        .where(Table.table_id == table_id)
    )
    result = await db.execute(stmt)
    table_to_update = result.scalar_one()

    if not table_to_update:
        raise ValueError(f"ID가 {table_id}인 테이블을 찾을 수 없습니다.")

    # 2. requst_data 안의 정보로 선택한 Table을 업데이트하기
    update_data = request_data.model_dump(exclude_unset=True)  # None인 field는 제외함
    for key, value in update_data.items():
        setattr(table_to_update, key, value)

    # 3. 수정 내용 반영
    await db.commit()
    # await db.refresh(table_to_update) -> expire_on_commit=False이므로 굳이 갱신 필요 없음

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
    customers = result.scalars().one_or_none()

    if customers is None:
        raise NoResultFound(
            f"{table_num}번 테이블을 현재 사용 중인(is_active==True) 손님이 없습니다."
        )

    return customers


async def add_new_customer_to_db(
    db: AsyncSession, request_data: CustomerCreateRequest
) -> Customer:
    """
    request_data를 바탕으로 새로운 Customer 객체를 만들어 DB에 삽입합니다.\n
    새로 생성한 Customer 객체를 반환합니다.
    """

    # request_data 안의 테이블 번호를 가진 테이블의 id 가져오기
    stmt = select(Table.table_id).where(Table.table_num == request_data.table_num)
    result = await db.execute(stmt)
    table_id = result.scalar_one_or_none()

    if table_id is None:
        raise NoResultFound(
            f"테이블 번호가 {request_data.table_num}인 테이블을 찾을 수 없습니다."
        )

    new_customer = Customer(table_id=table_id)
    db.add(new_customer)

    await db.commit()
    await db.refresh(new_customer)

    return new_customer


async def get_customer_order_summary_from_db(
    db: AsyncSession, customer_id: str, is_paid: bool | None
) -> OrderSummaryResponse:
    """
    해당 id를 가진 고객의 총 주문 금액 및 주문 내역을 가져옵니다.
    같은 (메뉴명, 옵션명)을 가진 주문을 하나의 종류로 묶어서 반환합니다.
    e.g.) (좋은 토닉, 살구맛)과 (좋은 토닉, 요거트맛)은 다른 종류로 취급됩니다.
    """

    # 1. 고객 존재 여부 먼저 확인 (PK 조회는 매우 빠릅니다)
    customer_exists = await db.get(Customer, customer_id)

    if not customer_exists:
        # 고객 자체가 없으면 NoResultFound를 던져서 404를 유도
        raise NoResultFound(
            f"요청한 아이디({customer_id})를 가진 손님이 존재하지 않습니다."
        )

    # 2. 고객은 존재하므로 주문 내역 집계 실행
    """
    SELECT
        m.menu_name,
        SUM(oi.quantity) as total_quantity,
        MAX(oi.price_at_order) as unit_price,
        oi.selected_option
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN menus m ON oi.menu_id = m.menu_id
    WHERE o.customer_id = '...' AND o.payment_status = true
    GROUP BY m.menu_name, oi.selected_option;
    """
    stmt = (
        select(
            Menu.menu_name,
            func.sum(OrderItem.quantity).label("total_quantity"),
            func.max(OrderItem.price_at_order).label("unit_price"),
            OrderItem.selected_option,
        )
        .join(OrderItem.menu)
        .join(OrderItem.order)
        .where(Order.customer_id == customer_id)
    )

    if is_paid is not None:
        stmt = stmt.where(Order.is_paid == is_paid)

    stmt = stmt.group_by(Menu.menu_name, OrderItem.selected_option)

    result = await db.execute(stmt)

    # total_quantity, unit_price 레이블을 사용하기 위해 mappings() 사용
    rows = result.mappings().all()

    order_items = []
    total_amount = 0
    for row in rows:
        item = OrderItemSummaryResponse(
            menu_name=row["menu_name"],
            total_quantity=row["total_quantity"],
            unit_price=row["unit_price"],
            selected_option=row["selected_option"],
        )
        order_items.append(item)
        total_amount += row["total_quantity"] * row["unit_price"]

    order_summary = OrderSummaryResponse(
        total_amount=total_amount, order_items=order_items
    )

    return order_summary


# ========= Menu 관련 로직 ===========================================
async def get_menus_from_db(db: AsyncSession) -> list[Menu]:
    stmt = select(Menu)
    result = await db.execute(stmt)
    menus = result.scalars().all()

    return menus


async def add_new_menu_to_db(db: AsyncSession, request_data: MenuCreateRequest) -> Menu:
    new_menu = Menu(**request_data.model_dump())
    db.add(new_menu)
    await db.commit()
    await db.refresh(new_menu)

    return new_menu


# ========= Order 관련 로직 ===========================================
async def get_orders_from_db(
    db: AsyncSession, is_paid: bool | None
) -> list[OrderDetail]:
    """
    SELECT o.order_id, (orders 안의 나머지 칼럼들), t.table_num
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN tables t ON c.table_id = t.table_id
    """
    stmt = (
        select(Order, Table.table_num)
        .join(Order.customer)
        .join(Customer.table)
        .options(
            selectinload(Order.items)
            .joinedload(OrderItem.menu)
            .load_only(Menu.menu_name)
        )
        .order_by(Order.order_time.desc())
    )

    if is_paid is not None:
        stmt = stmt.where(Order.is_paid == is_paid)

    result = await db.execute(stmt)
    rows: list[Row] = result.mappings().all()

    order_details = []
    for row in rows:
        order_obj: Order = row["Order"]

        order_item_briefs = [
            OrderItemBrief(
                menu_name=item.menu.menu_name,
                quantity=item.quantity,
                selected_option=item.selected_option,
                is_served=item.is_served,
            )
            for item in order_obj.items
        ]

        order_detail = OrderDetail(
            order_id=order_obj.order_id,
            table_num=row["table_num"],  # DB에서 가져온 table_num 주입!
            customer_id=order_obj.customer_id,
            order_time=order_obj.order_time,
            total_price=order_obj.total_price,
            depositor=order_obj.depositor,
            is_paid=order_obj.is_paid,
            memo=order_obj.memo,
            items=order_item_briefs,  # 위에서 새로 만든 order_item_briefs 삽입
        )

        order_details.append(order_detail)

    return order_details


async def add_new_order_to_db(
    db: AsyncSession, request_data: OrderCreateRequest
) -> tuple[Order, OrderDetail]:
    # 1. Order 객체 생성
    new_order = Order(
        customer_id=request_data.customer_id,
        total_price=request_data.total_price,
        depositor=request_data.depositor,
        # items 리스트에 직접 OrderItem 객체들을 담아줍니다.
        # 이렇게 하면 SQLAlchemy가 flush/commit 시점에 자동으로 order_id를 채워줍니다.
        items=[OrderItem(**item.model_dump()) for item in request_data.items],
    )

    # 2. 부모 객체만 추가 (자식인 items는 관계 설정 덕분에 같이 추가됨)
    db.add(new_order)

    # 3. 새로운 주문을 DB에 저장 (여기서 실제로 INSERT 쿼리가 날아감)
    await db.commit()

    # 4. DB에서 생성된 order_id, order_time 등을 가져오기 위해 new_order을 새로고침함
    # models.py에서 Order의 items를 lazy="selectin"으로 설정하고
    # await db.refresh(new_order) 한 줄로 해결하는 방법도 있지만,
    # eager loading으로 new_order에 딸린 items까지 같이 불러온다는 걸
    # 명시적으로 보여주기 위해 아래와 같이 씀.
    stmt = (
        select(Order, Table.table_num)
        .join(Order.customer)
        .join(Customer.table)
        .options(
            # 1. Order의 items를 selectinload로 가져오고
            selectinload(Order.items)
            # 2. 그 내부의 각 item에 대해 menu를 joinedload로 즉시 로딩합니다.
            .joinedload(OrderItem.menu).load_only(Menu.menu_name)
        )
        .where(Order.order_id == new_order.order_id)
    )
    result = await db.execute(stmt)
    row: Row = result.mappings().one()

    new_order: Order = row["Order"]

    new_order_item_briefs = [
        OrderItemBrief(
            menu_name=item.menu.menu_name,
            quantity=item.quantity,
            selected_option=item.selected_option,
            is_served=item.is_served,
        )
        for item in new_order.items
    ]

    new_order_detail = OrderDetail(
        order_id=new_order.order_id,
        table_num=row["table_num"],  # DB에서 가져온 table_num 주입!
        customer_id=new_order.customer_id,
        order_time=new_order.order_time,
        total_price=new_order.total_price,
        depositor=new_order.depositor,
        is_paid=new_order.is_paid,
        memo=new_order.memo,
        items=new_order_item_briefs,  # 위에서 만든 OrderItemBrief 리스트 넣기
    )

    return new_order_detail


async def update_order_data_in_db(
    db: AsyncSession,
    order_id: str,
    request_data: BaseModel,  # 모든 Pydantic 모델 허용 (주문의 depositor 변경 등도 처리 가능)
) -> OrderDetail:

    # 1. 업데이트할 주문 조회
    stmt = select(Order).where(Order.order_id == order_id)
    result = await db.execute(stmt)
    order_to_update = result.scalar_one_or_none()

    if order_to_update is None:
        raise NoResultFound(f"order_id가 {order_id}인 주문이 존재하지 않습니다.")

    # 2. 값 업데이트
    update_data = request_data.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        if hasattr(order_to_update, key):  # 모델에 해당 필드가 있는지 확인 후 할당
            setattr(order_to_update, key, val)

    # 3. 업데이트를 DB에 반영 및 반환
    await db.commit()
    return order_to_update


# ========= Order Item 관련 로직 ===========================================


async def update_order_item_data_in_db(
    db: AsyncSession,
    order_id: str,
    menu_id: str,
    selected_option: str | None,
    request_data: BaseModel,
) -> OrderItem:

    stmt = select(OrderItem).where(
        OrderItem.order_id == order_id,
        OrderItem.menu_id == menu_id,
        OrderItem.selected_option == selected_option,
    )
    # 옵션 선택이 필수가 아닌 메뉴가 있는 경우,
    # selected_option 값이 None이어도 where 안에 넣어두지 않으면 특정 옵션이 선택된 같은 menu_id의 다른 항목까지 여러개가 불러와질 수 있음
    # 즉, 위 코드처럼 OrderItem.selected_option == None임을 명시하는 것이 안전함

    result = await db.execute(stmt)
    order_item_to_update: OrderItem | None = result.scalar_one_or_none()

    if order_item_to_update is None:
        raise NoResultFound(
            f"(order_id: {order_id},\n menu_id: {menu_id},\n selected_option: {selected_option})을 만족하는 주문 항목이 존재하지 않습니다."
        )

    update_data = request_data.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        if hasattr(order_item_to_update, key):
            setattr(order_item_to_update, key, val)

    await db.commit()

    return order_item_to_update


# ========= External 관련 로직 ===========================================


async def compare_payment_info_with_db(
    db: AsyncSession, request_data: PaymentConfirmInfo
) -> str:
    depositor, total_price = _extract_payment_info(request_data)

    stmt = select(Order.order_id).where(
        Order.depositor == depositor, Order.total_price == total_price
    )
    result = await db.execute(stmt)
    order_id = result.scalar_one_or_none()

    if order_id is None:
        raise NoResultFound(
            f"입금자명 '{depositor}'으로 '{total_price}원'을 입금해야 하는 주문이 존재하지 않습니다."
        )

    order_payment_update_request = OrderPaymentUpdateRequest(is_paid=True)

    await update_order_data_in_db(
        db=db, order_id=order_id, request_data=order_payment_update_request
    )

    return order_id


import re


def _extract_payment_info(data: PaymentConfirmInfo) -> tuple[str, int]:
    # 1. 입금액 추출 (title에서 숫와 쉼표만 추출)
    # r"(\d{1,3}(?:,\d{3}))원* (더 엄격한 버전) : 1,000 또는 10,000 등 쉼표가 포함된 숫자 패턴
    price_match = re.search(r"([\d,]+)원", data.title)
    total_price = int(price_match.group(1).replace(",", "")) if price_match else 0

    # 2. 입금자명 추출 (message에서 ' →' 앞부분 추출)
    # ^(.+?)\s?→ : 문자열 시작부터 ' →' 기호 전까지의 최소 일치 패턴
    depositor_match = re.search(r"^(.+?)\s?→", data.message)
    depositor = depositor_match.group(1).strip() if depositor_match else "Unknown"

    return depositor, total_price
