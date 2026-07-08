from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models import TaskStatus, TaskPriority

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.todo
    priority: TaskPriority = TaskPriority.medium
    due_date: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[str] = None

class TaskResponse(TaskBase):
    id: str
    owner_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    id: str
    email: str
    display_name: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    display_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class UserSettingsBase(BaseModel):
    theme: str = "system"
    email_notifications: bool = True
    due_date_reminders: bool = True
    product_updates: bool = False
    language: str = "English (US)"
    timezone: str = "Pacific Time (PT)"

class UserSettingsUpdate(BaseModel):
    theme: Optional[str] = None
    email_notifications: Optional[bool] = None
    due_date_reminders: Optional[bool] = None
    product_updates: Optional[bool] = None
    language: Optional[str] = None
    timezone: Optional[str] = None

class UserSettingsResponse(UserSettingsBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True
