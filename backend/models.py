from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SQLEnum, Boolean, Integer
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
    settings = relationship("UserSettings", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class UserSettings(Base):
    __tablename__ = "taskflow_user_settings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("taskflow_user.id"), unique=True)
    theme = Column(String, default="system")
    email_notifications = Column(Boolean, default=True)
    due_date_reminders = Column(Boolean, default=True)
    product_updates = Column(Boolean, default=False)
    language = Column(String, default="English (US)")
    timezone = Column(String, default="Pacific Time (PT)")
    
    user = relationship("User", back_populates="settings")

class Task(Base):
    __tablename__ = "taskflow_task"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    status = Column(SQLEnum(TaskStatus), default=TaskStatus.todo)
    priority = Column(SQLEnum(TaskPriority), default=TaskPriority.medium)
    due_date = Column(String, nullable=True)
    due_time = Column(String, nullable=True)
    reminder_offset = Column(Integer, default=0) # Minutes before due time
    reminder_sent = Column(Boolean, default=False)
    
    owner_id = Column(String, ForeignKey("taskflow_user.id"))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="tasks")

class Notification(Base):
    __tablename__ = "taskflow_notification"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("taskflow_user.id"), index=True)
    title = Column(String)
    message = Column(String)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="notifications")
