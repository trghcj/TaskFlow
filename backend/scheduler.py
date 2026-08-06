from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo
from database import SessionLocal
import models
from email_service import send_due_date_reminder, send_weekly_recap

TIMEZONE_MAP = {
    "Pacific Time (PT)": "America/Los_Angeles",
    "Eastern Time (ET)": "America/New_York",
    "Coordinated Universal Time (UTC)": "UTC",
    "Central European Time (CET)": "Europe/Paris",
    "Indian Standard Time (IST)": "Asia/Kolkata"
}

def check_due_tasks():
    print(f"[{datetime.now()}] Running background task check...")
    db = SessionLocal()
    try:
        # Find all users who want due date reminders
        settings = db.query(models.UserSettings).filter(models.UserSettings.due_date_reminders == True).all()
        
        utc_now = datetime.now(timezone.utc)
        
        for user_setting in settings:
            user = db.query(models.User).filter(models.User.id == user_setting.user_id).first()
            if not user or not user.email:
                continue
                
            # Convert server UTC time to the user's specific timezone as a naive datetime
            iana_tz = TIMEZONE_MAP.get(user_setting.timezone, "UTC")
            try:
                user_tz = ZoneInfo(iana_tz)
            except Exception:
                user_tz = timezone.utc
                
            now = utc_now.astimezone(user_tz).replace(tzinfo=None)
                
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

def send_weekly_recap_job():
    print(f"[{datetime.now()}] Running weekly recap job...")
    db = SessionLocal()
    try:
        users = db.query(models.User).all()
        # Find tasks completed in the last 7 days
        seven_days_ago = datetime.utcnow() - timedelta(days=7)

        for user in users:
            if not user.email:
                continue

            completed_tasks = db.query(models.Task).filter(
                models.Task.owner_id == user.id,
                models.Task.status == models.TaskStatus.completed,
                # For simplicity, assuming tasks are marked completed and we just count them if they exist as completed
                # Ideally we'd have a 'completed_at' timestamp. If not, we just count all completed or use created_at roughly
            ).all()

            # Just send the total count they have completed so far as a "recap"
            completed_count = len(completed_tasks)
            if completed_count > 0:
                print(f"Sending weekly recap to {user.email}")
                send_weekly_recap(user.email, completed_count, user.current_streak)
    except Exception as e:
        print(f"Error in weekly recap job: {e}")
    finally:
        db.close()

scheduler = BackgroundScheduler()
# Run every 5 minutes to accurately catch specific minute/hour reminders
scheduler.add_job(check_due_tasks, "interval", minutes=5)
# Run weekly recap on Sunday at 8 PM (20:00)
scheduler.add_job(send_weekly_recap_job, "cron", day_of_week="sun", hour=20)

