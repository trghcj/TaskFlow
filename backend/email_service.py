import os
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

def send_due_date_reminder(to_email: str, tasks: list):
    if not resend.api_key:
        print("Warning: RESEND_API_KEY not set. Skipping email.")
        return False
        
    try:
        task_list_html = "".join([f"<li><strong>{t.title}</strong> (Due: {t.due_date} at {t.due_time or '00:00'})</li>" for t in tasks])
        
        html_content = f"""
        <h2>TaskFlow: You have tasks due soon!</h2>
        <p>This is a quick reminder that the following tasks are due soon:</p>
        <ul>
            {task_list_html}
        </ul>
        <p>Log in to <a href="https://taskflow-ds.vercel.app">TaskFlow</a> to manage your tasks.</p>
        """
        
        params = {
            "from": "TaskFlow <onboarding@resend.dev>",
            "to": [to_email],
            "subject": "Reminder: Tasks Due Soon",
            "html": html_content
        }
        
        response = resend.Emails.send(params)
        print(f"Sent reminder email to {to_email}: {response}")
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

def send_weekly_recap(to_email: str, completed_count: int, streak: int):
    if not resend.api_key:
        print("Warning: RESEND_API_KEY not set. Skipping weekly recap email.")
        return False
        
    try:
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4f46e5;">Your Weekly TaskFlow Recap 🚀</h2>
            <p>Great job this week! Here is a summary of what you've accomplished:</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0;">Weekly Stats</h3>
                <p style="margin: 5px 0;"><strong>✅ Tasks Completed:</strong> {completed_count}</p>
                <p style="margin: 5px 0;"><strong>🔥 Current Streak:</strong> {streak} days</p>
            </div>
            
            <p>Keep up the great momentum into next week!</p>
            <p>Log in to <a href="https://taskflow-ds.vercel.app" style="color: #4f46e5;">TaskFlow</a> to plan your upcoming week.</p>
        </div>
        """
        
        params = {
            "from": "TaskFlow <onboarding@resend.dev>",
            "to": [to_email],
            "subject": "Your Weekly TaskFlow Recap 🚀",
            "html": html_content
        }
        
        response = resend.Emails.send(params)
        print(f"Sent weekly recap to {to_email}: {response}")
        return True
    except Exception as e:
        print(f"Error sending weekly recap: {str(e)}")
        return False
