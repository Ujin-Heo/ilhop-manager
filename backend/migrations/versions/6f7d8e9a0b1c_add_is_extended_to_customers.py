"""add is_extended to customers

Revision ID: 6f7d8e9a0b1c
Revises: 2ef4082e0ceb
Create Date: 2026-05-13 15:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6f7d8e9a0b1c'
down_revision: Union[str, Sequence[str], None] = '2ef4082e0ceb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('customers', sa.Column('is_extended', sa.Boolean(), server_default=sa.text('false'), nullable=False))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('customers', 'is_extended')
