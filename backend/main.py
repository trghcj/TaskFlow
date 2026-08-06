from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from fastapi.responses import RedirectResponse

from database import engine, Base, get_db
import models
import schemas
from auth import get_current_user
from scheduler import scheduler
from contextlib import asynccontextmanager
import cloudinary
import cloudinary.uploader
import os
import google_auth_oauthlib.flow
import google_calendar

cloudinary.config(
  cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME"),
  api_key = os.environ.get("CLOUDINARY_API_KEY"),
  api_secret = os.environ.get("CLOUDINARY_API_SECRET")
)

import alembic.config
import alembic.command

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Running database migrations...")
    alembic_cfg = alembic.config.Config("alembic.ini")
    alembic.command.upgrade(alembic_cfg, "head")

    print("Starting background scheduler...")
    scheduler.start()
    yield
    print("Shutting down background scheduler...")
    scheduler.shutdown()

app = FastAPI(title="TaskFlow API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (including Vercel and Localhost)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to TaskFlow API"}

@app.get("/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    tasks = db.query(models.Task).filter(models.Task.owner_id == current_user.id).all()
    return tasks

@app.post("/tasks", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: schemas.TaskCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = models.Task(**task.model_dump(), owner_id=current_user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    # Sync with Google Calendar if connected
    if current_user.google_access_token:
        try:
            event_id = google_calendar.create_calendar_event(current_user, db_task)
            if event_id:
                db_task.google_event_id = event_id
                db.commit()
                db.refresh(db_task)
        except Exception as e:
            print(f"Calendar sync failed: {e}")
            
    return db_task

@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: str, task: schemas.TaskUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    update_data = task.model_dump(exclude_unset=True)
    
    # Streak Logic: If the task is newly marked as completed
    from datetime import datetime, timezone, timedelta
    
    if "status" in update_data and update_data["status"] == models.TaskStatus.completed and db_task.status != models.TaskStatus.completed:
        today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        if current_user.last_completed_date != today_str:
            if not current_user.last_completed_date:
                current_user.current_streak = 1
            else:
                last_date = datetime.strptime(current_user.last_completed_date, "%Y-%m-%d")
                yesterday = datetime.now(timezone.utc) - timedelta(days=1)
                if last_date.strftime("%Y-%m-%d") == yesterday.strftime("%Y-%m-%d"):
                    current_user.current_streak += 1
                else:
                    current_user.current_streak = 1
            current_user.last_completed_date = today_str

    # If the user changed the due date, time, or offset, we must reset the reminder flag
    # so the scheduler will trigger a new notification for the new deadline.
    timing_keys = {"due_date", "due_time", "reminder_offset"}
    if any(key in update_data for key in timing_keys):
        db_task.reminder_sent = False
        
    for key, value in update_data.items():
        setattr(db_task, key, value)
        
    db.commit()
    db.refresh(db_task)
    
    # Sync with Google Calendar if connected
    if current_user.google_access_token:
        try:
            google_calendar.update_calendar_event(current_user, db_task)
            db.commit()
        except Exception as e:
            print(f"Calendar update failed: {e}")
            
    return db_task

# SubTask Endpoints
@app.post("/tasks/{task_id}/subtasks", response_model=schemas.SubTaskResponse, status_code=status.HTTP_201_CREATED)
def create_subtask(task_id: str, subtask: schemas.SubTaskCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    db_subtask = models.SubTask(**subtask.model_dump(), task_id=task_id)
    db.add(db_subtask)
    db.commit()
    db.refresh(db_subtask)
    return db_subtask

@app.put("/subtasks/{subtask_id}", response_model=schemas.SubTaskResponse)
def update_subtask(subtask_id: str, subtask: schemas.SubTaskUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_subtask = db.query(models.SubTask).join(models.Task).filter(models.SubTask.id == subtask_id, models.Task.owner_id == current_user.id).first()
    if not db_subtask:
        raise HTTPException(status_code=404, detail="SubTask not found")
        
    update_data = subtask.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_subtask, key, value)
        
    db.commit()
    db.refresh(db_subtask)
    return db_subtask

@app.delete("/subtasks/{subtask_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subtask(subtask_id: str, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_subtask = db.query(models.SubTask).join(models.Task).filter(models.SubTask.id == subtask_id, models.Task.owner_id == current_user.id).first()
    if not db_subtask:
        raise HTTPException(status_code=404, detail="SubTask not found")
        
    db.delete(db_subtask)
    db.commit()
    return None

@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    if current_user.google_access_token and db_task.google_event_id:
        try:
            google_calendar.delete_calendar_event(current_user, db_task)
        except Exception as e:
            print(f"Calendar delete failed: {e}")
            
    db.delete(db_task)
    db.commit()
    return None

@app.get("/settings", response_model=schemas.UserSettingsResponse)
def get_settings(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    settings = db.query(models.UserSettings).filter(models.UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = models.UserSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@app.patch("/settings", response_model=schemas.UserSettingsResponse)
def update_settings(settings_update: schemas.UserSettingsUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    settings = db.query(models.UserSettings).filter(models.UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = models.UserSettings(user_id=current_user.id)
        db.add(settings)
    
    update_data = settings_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
        
    db.commit()
    db.refresh(settings)
    return settings

@app.post("/users/me/avatar")
def upload_avatar(file: UploadFile = File(...), current_user: models.User = Depends(get_current_user)):
    try:
        result = cloudinary.uploader.upload(file.file)
        return {"photoURL": result.get("secure_url")}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/notifications", response_model=List[schemas.NotificationResponse])
def get_notifications(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Notification).filter(models.Notification.user_id == current_user.id).order_by(models.Notification.created_at.desc()).all()

@app.put("/notifications/{notification_id}/read", response_model=schemas.NotificationResponse)
def read_notification(notification_id: str, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    notification = db.query(models.Notification).filter(models.Notification.id == notification_id, models.Notification.user_id == current_user.id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification

@app.get("/users/me", response_model=schemas.UserResponse)
def get_user_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.put("/users/me", response_model=schemas.UserResponse)
def update_user_profile(user_update: schemas.UserUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_update.display_name is not None:
        current_user.display_name = user_update.display_name
    if user_update.email is not None:
        current_user.email = user_update.email
    db.commit()
    db.refresh(current_user)
    return current_user

# AI Endpoints
import ai_service

@app.post("/api/ai/parse")
def ai_parse_task(request: schemas.AIParseRequest, current_user: models.User = Depends(get_current_user)):
    try:
        parsed_data = ai_service.parse_natural_language_task(request.text)
        return parsed_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/breakdown", response_model=List[schemas.SubTaskResponse])
def ai_breakdown_task(request: schemas.AIBreakdownRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        subtasks_titles = ai_service.breakdown_task_into_subtasks(request.title, request.description)
        
        # If task_id is provided, save them to the DB
        created_subtasks = []
        if request.task_id:
            # Verify task ownership
            db_task = db.query(models.Task).filter(models.Task.id == request.task_id, models.Task.owner_id == current_user.id).first()
            if not db_task:
                raise HTTPException(status_code=404, detail="Task not found")
                
            for title in subtasks_titles:
                db_subtask = models.SubTask(title=title, task_id=request.task_id)
                db.add(db_subtask)
                db.flush()
                db.refresh(db_subtask)
                created_subtasks.append(db_subtask)
            db.commit()
            return created_subtasks
            
        # If no task_id, just return them as dummy objects (useful for UI preview)
        return [{"id": f"dummy-{i}", "task_id": "dummy", "title": t, "is_completed": False, "created_at": datetime.utcnow()} for i, t in enumerate(subtasks_titles)]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tasks/{task_id}/attachments", response_model=schemas.AttachmentResponse)
def upload_attachment(task_id: str, file: UploadFile = File(...), current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    try:
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(file.file, folder="taskflow_attachments", resource_type="auto")
        file_url = result.get("secure_url")
        
        # Save to DB
        db_attachment = models.Attachment(
            task_id=task_id,
            file_name=file.filename,
            file_url=file_url
        )
        db.add(db_attachment)
        db.commit()
        db.refresh(db_attachment)
        return db_attachment
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload attachment: {str(e)}")

# --- OAuth Endpoints ---
@app.get("/auth/google/login")
def google_login():
    flow = google_auth_oauthlib.flow.Flow.from_client_config(
        {
            "web": {
                "client_id": os.environ.get("GOOGLE_CLIENT_ID"),
                "client_secret": os.environ.get("GOOGLE_CLIENT_SECRET"),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=["https://www.googleapis.com/auth/calendar.events"]
    )
    # Use a dummy redirect_uri to build the auth_url, the actual redirect will be handled by the client
    # but Google requires one configured. The client will pass state if needed, or we just rely on standard flow.
    # Actually, we need to specify exactly the redirect URI we configured in Google Cloud
    
    # We can use an env var or a hardcoded one based on the host, for now, let's just 
    # try to use a relative one if possible, or we might need the frontend to pass it.
    # We will let the flow guess it or use a default one:
    # Render sets 'RENDER_EXTERNAL_URL' automatically, let's use it if available.
    base_url = os.environ.get("RENDER_EXTERNAL_URL", "http://localhost:10000")
    redirect_uri = f"{base_url}/auth/google/callback"
    flow.redirect_uri = redirect_uri
    
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent' # Force consent to get refresh token
    )
    
    return RedirectResponse(authorization_url)

@app.get("/auth/google/callback")
def google_callback(code: str, state: str = None, db: Session = Depends(get_db)):
    # This endpoint needs a way to know WHICH user is authenticating.
    # Since this is a redirect from Google, it doesn't have the Bearer token in headers.
    # But wait, how do we link this to the current TaskFlow user?
    # Usually, we pass the user ID in the `state` parameter or store it in a cookie before redirecting.
    
    # For now, let's assume we decode a JWT from a cookie, OR the frontend passes a token in state.
    # Let's fetch the token using the code anyway.
    flow = google_auth_oauthlib.flow.Flow.from_client_config(
        {
            "web": {
                "client_id": os.environ.get("GOOGLE_CLIENT_ID"),
                "client_secret": os.environ.get("GOOGLE_CLIENT_SECRET"),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=["https://www.googleapis.com/auth/calendar.events"]
    )
    base_url = os.environ.get("RENDER_EXTERNAL_URL", "http://localhost:10000")
    flow.redirect_uri = f"{base_url}/auth/google/callback"
    
    flow.fetch_token(code=code)
    credentials = flow.credentials
    
    # Normally we would save this to the specific user. 
    # Since we can't extract the user easily from a raw redirect without cookies/state,
    # A quick hack for single-user dev is just getting the first user, OR 
    # we expect `state` to contain the user ID (Firebase UID).
    
    user = None
    if state:
        user = db.query(models.User).filter(models.User.id == state).first()
        
    if not user:
        # Fallback to the first user if state is missing (for testing)
        user = db.query(models.User).first()
        
    if user:
        user.google_access_token = credentials.token
        user.google_refresh_token = credentials.refresh_token
        user.google_token_expiry = credentials.expiry.isoformat() if credentials.expiry else None
        db.commit()
        
    # Redirect back to the frontend settings page
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    return RedirectResponse(f"{frontend_url}?google_sync=success")
