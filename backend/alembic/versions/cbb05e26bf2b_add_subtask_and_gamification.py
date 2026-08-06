"""Add SubTask and Gamification

Revision ID: cbb05e26bf2b
Revises: b1f1a1a1a1a1
Create Date: 2026-08-06 20:36:03.387142

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'cbb05e26bf2b'
down_revision: Union[str, None] = 'b1f1a1a1a1a1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('taskflow_subtask',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('task_id', sa.String(), nullable=True),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('is_completed', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['task_id'], ['taskflow_task.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_taskflow_subtask_id'), 'taskflow_subtask', ['id'], unique=False)
    op.create_index(op.f('ix_taskflow_subtask_task_id'), 'taskflow_subtask', ['task_id'], unique=False)
    
    op.add_column('taskflow_user', sa.Column('current_streak', sa.Integer(), nullable=True))
    op.add_column('taskflow_user', sa.Column('last_completed_date', sa.String(), nullable=True))

def downgrade() -> None:
    op.drop_column('taskflow_user', 'last_completed_date')
    op.drop_column('taskflow_user', 'current_streak')
    op.drop_index(op.f('ix_taskflow_subtask_task_id'), table_name='taskflow_subtask')
    op.drop_index(op.f('ix_taskflow_subtask_id'), table_name='taskflow_subtask')
    op.drop_table('taskflow_subtask')
    # ### end Alembic commands ###
