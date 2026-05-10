"""use order_item_id as primary key for order_items

Revision ID: dbc53cbccdff
Revises: ec982905412a
Create Date: 2026-05-11 00:36:08.673948

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dbc53cbccdff'
down_revision: Union[str, Sequence[str], None] = 'ec982905412a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. 기존 복합 PK (order_id, menu_id) 삭제
    # PostgreSQL에서 Primary Key 제약 조건의 이름은 보통 '테이블명_pkey'입니다.
    # 초기 마이그레이션 파일 확인 결과 별도 이름을 지정하지 않았으므로 'order_items_pkey'일 가능성이 높습니다.
    op.drop_constraint('order_items_pkey', 'order_items', type_='primary')

    # 2. 새로운 order_item_id 컬럼 추가
    op.add_column('order_items', sa.Column('order_item_id', sa.UUID(), server_default=sa.text('uuid_generate_v4()'), nullable=False))

    # 3. 새로운 PK 설정
    op.create_primary_key('order_items_pkey', 'order_items', ['order_item_id'])


def downgrade() -> None:
    """Downgrade schema."""
    # 1. 새로운 PK 삭제
    op.drop_constraint('order_items_pkey', 'order_items', type_='primary')

    # 2. order_item_id 컬럼 삭제
    op.drop_column('order_items', 'order_item_id')

    # 3. 기존 복합 PK 복구
    op.create_primary_key('order_items_pkey', 'order_items', ['order_id', 'menu_id'])
