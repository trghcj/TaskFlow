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
                
            # Find tasks for this user that are not completed and haven't had a reminder sent yet
            due_soon_tasks = []
            tasks = db.query(models.Task).filter(
                models.Task.owner_id == user.id,
                models.Task.status != models.TaskStatus.completed,
                models.Task.due_date != None,
                models.Task.reminder_sent == False
            ).all()
            
            for task in tasks:
                try:
                    # Parse date and time
                    due_date_str = task.due_date
                    due_time_str = task.due_time or "00:00" # Default to midnight if no time specified
                    
                    due_datetime_str = f"{due_date_str} {due_time_str}"
                    due_datetime = datetime.strptime(due_datetime_str, "%Y-%m-%d %H:%M")
                    
                    # Calculate exact reminder time based on offset
                    offset_minutes = task.reminder_offset or 0
                    reminder_time = due_datetime - timedelta(minutes=offset_minutes)
                    
                    # If we have reached or passed the reminder time, queue it to send
                    if now >= reminder_time:
                        due_soon_tasks.append(task)
                        task.reminder_sent = True # Mark as sent so it won't be spammed again
                except ValueError:
                    continue
            
            if due_soon_tasks:
                print(f"Sending reminder to {user.email} for {len(due_soon_tasks)} tasks")
                send_due_date_reminder(user.email, due_soon_tasks)
                
                # Create an in-app notification
                notification = models.Notification(
                    user_id=user.id,
                    title="Task Reminder",
                    message=f"You have {len(due_soon_tasks)} task(s) due soon."
                )
                db.add(notification)
                db.commit()
                
    except Exception as e:
        print(f"Error in scheduled task: {e}")
    finally:
        db.close()

scheduler = BackgroundScheduler()
# Run every 5 minutes to accurately catch specific minute/hour reminders
scheduler.add_job(check_due_tasks, "interval", minutes=5)
