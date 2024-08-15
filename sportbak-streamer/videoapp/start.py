import logging
import uvicorn
from datetime import datetime

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi import Depends

import gi
from .core import config
from .video.capture import Capture 
from .video.assembler import Assembler 
from .core.connections import ConnectionManager
from .core.context import Context
from .video.controller import connected, handle_message, disconnected
gi.require_version('Gst', '1.0')
from gi.repository import Gst, GLib
import threading
import time

logging.basicConfig(format='%(asctime)s;%(levelname)s;%(message)s', level=logging.INFO)

app = FastAPI(title="Futbak", root_path="/")

Gst.init(None)
g_loop = threading.Thread(target=GLib.MainLoop().run)
g_loop.daemon = True
g_loop.start()

context = Context(config.CAMERA_URL, config.CAMERA_USER, config.CAMERA_PWD, config.MEDIA_PATH, config.DEFAULT_ENCODER)
timeoutThread = None

def stop_current_timeout_theard():
    global timeoutThread
    if timeoutThread is not None:
        timeoutThread.cancel()
        timeoutThread = None

def socket_disconnected():
    global timeoutThread
    stop_current_timeout_theard()
    timeoutThread =  threading.Timer(5,timeout_socket_disconnected)
    timeoutThread.start()

def timeout_socket_disconnected():
    if context.session.recording:
        logging.info("Timeout disconnection of socket - Stopping session...")
        context.session.stop() #stop current video session after delay for safety of disk

@app.websocket("/")
async def websocket_endpoint_manager_backend(websocket: WebSocket):
    await websocket_endpoint(websocket, True)

@app.websocket("/webrtc")
async def websocket_endpoint_webrtc(websocket: WebSocket):
    
    await websocket_endpoint(websocket, False)


async def websocket_endpoint(websocket: WebSocket, enableTimeout : bool = False):
    global timeoutThread
    await context.connections.connect(websocket)
    try:
        await connected(context, websocket)
        if enableTimeout:
            print("Socket connected - Manager Backend")
        else:
            print("Socket connected - Web RTC")
        if enableTimeout:
            stop_current_timeout_theard()
        while True:
            data = await websocket.receive_text()
            logging.info(data)
            await handle_message(context, websocket, data)
    except WebSocketDisconnect:
        if enableTimeout:
            socket_disconnected()
        await disconnected(context, websocket)
        context.connections.disconnect(websocket)

logging.basicConfig(level=logging.INFO)
