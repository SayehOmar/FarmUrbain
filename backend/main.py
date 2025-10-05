from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from services.server_control_service import (
    start_server,
    stop_server,
    check_server_status,
)
import os

app = FastAPI(title="SaaS Server Control Panel")

# Serve static files (control page, JS, CSS)
static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)

app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/control", response_class=HTMLResponse)
def get_control_panel():
    """
    Returns the HTML control page that allows starting/stopping the server.
    """
    html_path = os.path.join(static_dir, "control.html")
    if not os.path.exists(html_path):
        return HTMLResponse("<h1>Control page not found</h1>", status_code=404)

    with open(html_path, "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())


@app.get("/start-server")
def start():
    """
    Start the FastAPI server (if not already running).
    """
    message = start_server()
    return JSONResponse({"status": message})


@app.get("/stop-server")
def stop():
    """
    Stop the FastAPI server (if running).
    """
    message = stop_server()
    return JSONResponse({"status": message})


@app.get("/status")
def status():
    """
    Check if the FastAPI server is running.
    """
    running = check_server_status()
    return JSONResponse({"running": running})
