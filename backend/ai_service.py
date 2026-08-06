import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def parse_natural_language_task(text: str) -> dict:
    """
    Parses natural language into structured task fields: title, due_date, due_time, priority.
    """
    if not GEMINI_API_KEY:
        raise Exception("Gemini API key is not configured.")

    model = genai.GenerativeModel(
        "gemini-3.5-flash",
        generation_config={"response_mime_type": "application/json"}
    )
    
    prompt = f"""
    You are an intelligent task parser. Extract the following information from the user's natural language input:
    - title: A clear, concise title for the task.
    - due_date: The due date in YYYY-MM-DD format (if applicable, else null). Assume today is {os.popen("date /t").read().strip()}
    - due_time: The due time in HH:MM format (24-hour clock, if applicable, else null).
    - priority: One of ["low", "medium", "high"]. Infer this from the tone or explicit words like "urgent", "ASAP" (defaults to "medium" if unsure).

    User Input: "{text}"
    
    Respond STRICTLY with a JSON object matching this schema:
    {{
      "title": "string",
      "due_date": "string | null",
      "due_time": "string | null",
      "priority": "string"
    }}
    """
    
    response = model.generate_content(prompt)
    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        print(f"Failed to parse AI response: {response.text}")
        return {"title": text, "due_date": None, "due_time": None, "priority": "medium"}

def breakdown_task_into_subtasks(task_title: str, task_description: str = "") -> list:
    """
    Breaks a complex task down into 3-5 logical subtasks.
    """
    if not GEMINI_API_KEY:
        raise Exception("Gemini API key is not configured.")

    model = genai.GenerativeModel(
        "gemini-3.5-flash",
        generation_config={"response_mime_type": "application/json"}
    )
    
    desc_text = f"\\nDescription: {task_description}" if task_description else ""
    prompt = f"""
    You are an intelligent task breakdown assistant. Break the following complex task into 3-5 logical, actionable subtasks.
    
    Task: {task_title}{desc_text}
    
    Respond STRICTLY with a JSON object containing a "subtasks" key mapping to a list of strings:
    {{
      "subtasks": ["subtask 1", "subtask 2", ...]
    }}
    """
    
    response = model.generate_content(prompt)
    try:
        data = json.loads(response.text)
        return data.get("subtasks", [])
    except json.JSONDecodeError:
        print(f"Failed to parse AI response: {response.text}")
        return []
