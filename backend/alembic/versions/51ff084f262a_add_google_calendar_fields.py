"""Add Google Calendar fields

Revision ID: 51ff084f262a
Revises: 4011e5381c8b
Create Date: 2026-08-07 00:44:40.780014

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '51ff084f262a'
down_revision: Union[str, None] = '4011e5381c8b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('taskflow_task', sa.Column('google_event_id', sa.String(), nullable=True))
    op.add_column('taskflow_user', sa.Column('google_access_token', sa.String(), nullable=True))
    op.add_column('taskflow_user', sa.Column('google_refresh_token', sa.String(), nullable=True))
    op.add_column('taskflow_user', sa.Column('google_token_expiry', sa.String(), nullable=True))

def downgrade() -> None:
    op.drop_column('taskflow_user', 'google_token_expiry')
    op.drop_column('taskflow_user', 'google_refresh_token')
    op.drop_column('taskflow_user', 'google_access_token')
    op.drop_column('taskflow_task', 'google_event_id')
