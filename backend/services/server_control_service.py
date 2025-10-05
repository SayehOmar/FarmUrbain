import subprocess
import psutil
import os

process = None  # Global variable to store the server process


def start_server():
    """
    Start the FastAPI server if it’s not already running.
    Returns a status message.
    """
    global process
    if process is not None and process.poll() is None:
        return "🚀 Server already running."

    try:
        # Use absolute path to uvicorn if necessary
        uvicorn_cmd = ["uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"]

        # Ensure cwd is the FastAPI folder
        cwd = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

        process = subprocess.Popen(uvicorn_cmd, cwd=cwd)
        return "✅ FastAPI server started."
    except Exception as e:
        return f"❌ Failed to start server: {e}"


def stop_server():
    """
    Stop the FastAPI server if it’s running.
    Returns a status message.
    """
    global process
    if process and process.poll() is None:
        try:
            parent = psutil.Process(process.pid)
            # Terminate all child processes
            for child in parent.children(recursive=True):
                child.terminate()
            parent.terminate()
            process.wait()
            process = None
            return "🛑 FastAPI server stopped."
        except Exception as e:
            return f"❌ Error stopping server: {e}"
    else:
        return "⚠️ Server not running."


def check_server_status():
    """
    Check if the FastAPI server process is alive.
    Returns True if running, False otherwise.
    """
    global process
    return process is not None and process.poll() is None
