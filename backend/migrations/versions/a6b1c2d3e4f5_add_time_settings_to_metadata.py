"""add time settings to metadata

Revision ID: a6b1c2d3e4f5
Revises: 6f7d8e9a0b1c
Create Date: 2026-05-13 16:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a6b1c2d3e4f5'
down_revision: Union[str, Sequence[str], None] = '6f7d8e9a0b1c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('metadata', sa.Column('standard_time', sa.Integer(), server_default=sa.text('90'), nullable=False))
    op.add_column('metadata', sa.Column('extra_time', sa.Integer(), server_default=sa.text('60'), nullable=False))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('metadata', 'extra_time')
    op.drop_column('metadata', 'standard_time')
