"""Add UserSettings table

Revision ID: a0d46e0d0757
Revises: a2f573325324
Create Date: 2026-07-08 15:07:25.289752

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a0d46e0d0757'
down_revision: Union[str, None] = 'a2f573325324'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('taskflow_user_settings',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('user_id', sa.String(), nullable=True),
    sa.Column('theme', sa.String(), nullable=True),
    sa.Column('email_notifications', sa.Boolean(), nullable=True),
    sa.Column('due_date_reminders', sa.Boolean(), nullable=True),
    sa.Column('product_updates', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['taskflow_user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_taskflow_user_settings_id'), 'taskflow_user_settings', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_taskflow_user_settings_id'), table_name='taskflow_user_settings')
    op.drop_table('taskflow_user_settings')
