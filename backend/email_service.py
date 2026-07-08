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
        task_list_html = "".join([f"<li><strong>{t.title}</strong> (Due: {t.due_date})</li>" for t in tasks])
        
        html_content = f"""
        <h2>TaskFlow: You have tasks due soon!</h2>
        <p>This is a quick reminder that the following tasks are due within the next 24 hours:</p>
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
