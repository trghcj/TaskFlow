"""Add language and timezone to UserSettings

Revision ID: 15ed5db05772
Revises: a0d46e0d0757
Create Date: 2026-07-08 15:40:44.706897

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '15ed5db05772'
down_revision: Union[str, None] = 'a0d46e0d0757'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('taskflow_user_settings', sa.Column('language', sa.String(), nullable=True))
    op.add_column('taskflow_user_settings', sa.Column('timezone', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('taskflow_user_settings', 'timezone')
    op.drop_column('taskflow_user_settings', 'language')
