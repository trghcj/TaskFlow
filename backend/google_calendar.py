import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from datetime import datetime
from database import SessionLocal
import models
import httplib2

def get_google_calendar_service(user: models.User):
    if not user.google_access_token or not user.google_refresh_token:
        return None
        
    creds = Credentials(
        token=user.google_access_token,
        refresh_token=user.google_refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.environ.get("GOOGLE_CLIENT_ID"),
        client_secret=os.environ.get("GOOGLE_CLIENT_SECRET")
    )
    
    # If the token is expired, it will auto-refresh when building the service
    # We should theoretically save the refreshed token, but the google client
    # handles the refresh under the hood using the refresh_token.
    try:
        service = build('calendar', 'v3', credentials=creds)
        return service
    except Exception as e:
        print(f"Error building google calendar service: {e}")
        return None

def create_calendar_event(user: models.User, task: models.Task):
    if not task.due_date:
        return None
        
    service = get_google_calendar_service(user)
    if not service:
        return None
        
    start_time_str = f"{task.due_date}T{task.due_time or '00:00'}:00"
    
    # Simple event structure
    event = {
        'summary': task.title,
        'description': task.description or '',
        'start': {
            'dateTime': start_time_str,
            'timeZone': user.settings.timezone.split('(')[0].strip() if user.settings else 'America/Los_Angeles',
        },
        'end': {
            'dateTime': start_time_str,
            'timeZone': user.settings.timezone.split('(')[0].strip() if user.settings else 'America/Los_Angeles',
        }
    }
    
    try:
        # Create event in the primary calendar
        created_event = service.events().insert(calendarId='primary', body=event).execute()
        return created_event.get('id')
    except Exception as e:
        print(f"Error creating google calendar event: {e}")
        return None

def update_calendar_event(user: models.User, task: models.Task):
    if not task.google_event_id:
        # If it doesn't have an event but now has a due date, create it
        if task.due_date:
            event_id = create_calendar_event(user, task)
            task.google_event_id = event_id
            return True
        return False
        
    if not task.due_date:
        # If it had an event but due date was removed, delete the event
        delete_calendar_event(user, task)
        task.google_event_id = None
        return True
        
    service = get_google_calendar_service(user)
    if not service:
        return False
        
    start_time_str = f"{task.due_date}T{task.due_time or '00:00'}:00"
    
    event = {
        'summary': task.title,
        'description': task.description or '',
        'start': {
            'dateTime': start_time_str,
            'timeZone': user.settings.timezone.split('(')[0].strip() if user.settings else 'America/Los_Angeles',
        },
        'end': {
            'dateTime': start_time_str,
            'timeZone': user.settings.timezone.split('(')[0].strip() if user.settings else 'America/Los_Angeles',
        }
    }
    
    try:
        service.events().update(calendarId='primary', eventId=task.google_event_id, body=event).execute()
        return True
    except Exception as e:
        print(f"Error updating google calendar event: {e}")
        return False

def delete_calendar_event(user: models.User, task: models.Task):
    if not task.google_event_id:
        return False
        
    service = get_google_calendar_service(user)
    if not service:
        return False
        
    try:
        service.events().delete(calendarId='primary', eventId=task.google_event_id).execute()
        return True
    except Exception as e:
        print(f"Error deleting google calendar event: {e}")
        return False
