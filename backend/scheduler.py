from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from database import SessionLocal
import models
from email_service import send_due_date_reminder

def check_due_tasks():
    print(f"[{datetime.now()}] Running background task check...")
    db = SessionLocal()
    try:
        # Find all users who want due date reminders
        settings = db.query(models.UserSettings).filter(models.UserSettings.due_date_reminders == True).all()
        
        now = datetime.now()
        tomorrow = now + timedelta(days=1)
        
        for user_setting in settings:
            user = db.query(models.User).filter(models.User.id == user_setting.user_id).first()
            if not user or not user.email:
                continue
                
            # Find tasks for this user that are due within the next 24 hours and not completed
            due_soon_tasks = []
            tasks = db.query(models.Task).filter(
                models.Task.owner_id == user.id,
                models.Task.status != models.TaskStatus.completed,
                models.Task.due_date != None
            ).all()
            
            for task in tasks:
                try:
                    # Due date is stored as string YYYY-MM-DD
                    due_date_obj = datetime.strptime(task.due_date, "%Y-%m-%d")
                    # Check if due date is between now and tomorrow
                    if now.date() <= due_date_obj.date() <= tomorrow.date():
                        due_soon_tasks.append(task)
                except ValueError:
                    continue
            
            if due_soon_tasks:
                print(f"Sending reminder to {user.email} for {len(due_soon_tasks)} tasks")
                send_due_date_reminder(user.email, due_soon_tasks)
                
                # Create an in-app notification
                notification = models.Notification(
                    user_id=user.id,
                    title="Tasks Due Soon!",
                    message=f"You have {len(due_soon_tasks)} task(s) due in the next 24 hours."
                )
                db.add(notification)
                db.commit()
                
    except Exception as e:
        print(f"Error in scheduled task: {e}")
    finally:
        db.close()

scheduler = BackgroundScheduler()
# In a real app, this might run every hour (trigger="cron", hour="*")
# For testing/demo purposes, we'll run it every 5 minutes
scheduler.add_job(check_due_tasks, "interval", minutes=5)
