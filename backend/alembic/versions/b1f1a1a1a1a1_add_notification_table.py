"""Add Notification table

Revision ID: b1f1a1a1a1a1
Revises: 15ed5db05772
Create Date: 2026-07-08 12:44:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b1f1a1a1a1a1'
down_revision: Union[str, None] = '15ed5db05772'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('taskflow_notification',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('user_id', sa.String(), nullable=True),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('message', sa.String(), nullable=True),
    sa.Column('is_read', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['taskflow_user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_taskflow_notification_id'), 'taskflow_notification', ['id'], unique=False)
    op.create_index(op.f('ix_taskflow_notification_user_id'), 'taskflow_notification', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_taskflow_notification_user_id'), table_name='taskflow_notification')
    op.drop_index(op.f('ix_taskflow_notification_id'), table_name='taskflow_notification')
    op.drop_table('taskflow_notification')
