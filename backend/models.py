from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
import uuid
from datetime import datetime, timezone
from database import Base

class TaskStatus(str, enum.Enum):
    todo = "todo"
    in_progress = "in-progress"
    review = "review"
    completed = "completed"

class TaskPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"

class User(Base):
    __tablename__ = "taskflow_user"

    id = Column(String, primary_key=True, index=True) # Firebase UID
    email = Column(String, unique=True, index=True)
    display_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    tasks = relationship("Task", back_populates="owner")

class Task(Base):
    __tablename__ = "taskflow_task"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    status = Column(SQLEnum(TaskStatus), default=TaskStatus.todo)
    priority = Column(SQLEnum(TaskPriority), default=TaskPriority.medium)
    due_date = Column(String, nullable=True)
    
    owner_id = Column(String, ForeignKey("taskflow_user.id"))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="tasks")
