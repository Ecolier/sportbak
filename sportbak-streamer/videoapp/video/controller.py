
import json
from ..core.context import Context
from fastapi import WebSocket


async def disconnected(context: Context, socket: WebSocket):
    context.session.stop_webrtc(socket)


async def send_status(context: Context, socket: WebSocket):
    await status(context, socket)

async def connected(context: Context, socket: WebSocket):
    await status(context, socket)

async def handle_message(context: Context, socket: WebSocket, message):
    try:
        obj = json.loads(message)
        if 'action' in obj:
            if obj['action'] == 'start':
                await start(context, socket)
            elif obj['action'] == 'start_webrtc':
                await start_webrtc(context, socket)
            elif obj['action'] == 'send_sdp':
                await send_sdp(context, socket, obj['params']["sdp"])  
            elif obj['action'] == 'send_ice':
                await send_ice(context, socket, obj['params']["ice"])                                
            elif obj['action'] == 'stop_webrtc':
                await stop_webrtc(context, socket)    
            elif obj['action'] == 'set_session':
                await set_session(context, socket, int(obj['params']["score_team1"]), int(obj['params']["score_team1"]), obj['params']["team1"], obj['params']["team2"], int(obj['params']["time"]), obj['params']["period"], bool(obj['params']["isPaused"]))                        
            elif obj['action'] == 'set_score':
                await set_score(context, socket, int(obj['params']["team_1"]), int(obj['params']["team_2"]))
            elif obj['action'] == 'set_teams':
                await set_teams(context, socket, obj['params']["team_1"], obj['params']["team_2"])     
            elif obj['action'] == 'set_time':
                await set_time(context, socket, int(obj['params']["time"]))               
            elif obj['action'] == 'pause':
                await pause(context, socket)
            elif obj['action'] == 'restart':
                await restart(context, socket)
            elif obj['action'] == 'video_restart':
                await video_restart(context, socket, obj['params']["sessionId"])                 
            elif obj['action'] == 'switch_period':
                await switch_period(context, socket, obj['params']["name"])                
            elif obj['action'] == 'stop':
                await stop(context, socket)
            elif obj['action'] == 'status':
                await status(context, socket)
            else: 
                await context.connections.broadcast({'action' : 'error', 'params': {'message': 'Invalid format for request : ' + obj['action']}})
    except Exception as e:
        await context.connections.broadcast({'action' : 'error', 'params': {'message': "{}".format(e)}})

async def start(context: Context, socket: WebSocket):
    context.session.start()
    await status(context, socket)

async def set_session(context: Context, socket: WebSocket, score_team1 : int, score_team2 : int, team1 : str, team2 : str, time : int, period : str, isPaused : bool):
    """context.session.switch_period(period) #set time to 0
    context.session.set_score(score_team1, score_team2)
    context.session.set_teams(team1, team2)
    context.session.set_time(time)
    if (isPaused):
        context.session.pause_time()   """
    await status(context, socket)

async def set_score(context: Context, socket: WebSocket, team_1: int, team_2: int):
    #context.session.set_score(team_1, team_2)
    await status(context, socket)

async def set_teams(context: Context, socket: WebSocket, team_1: str, team_2: str):
    #context.session.set_teams(team_1, team_2)
    await status(context, socket)

async def set_time(context: Context, socket: WebSocket, time: int):
    #context.session.set_time(time)
    await status(context, socket)

async def switch_period(context: Context, socket: WebSocket, name: str):
    #context.session.switch_period(name)
    await status(context, socket)

async def pause(context: Context, socket: WebSocket):
    #context.session.pause_time()
    await status(context, socket)

async def restart(context: Context, socket: WebSocket):
    #context.session.restart_time()
    await status(context, socket)

async def status(context: Context, socket: WebSocket):
    await socket.send_json({'action' : 'status', 'params': context.session.status()})

async def stop(context: Context, socket: WebSocket):
    context.session.stop()
    await status(context, socket)


async def start_webrtc(context: Context, socket: WebSocket):
    context.session.start_webrtc(socket)
    await status(context, socket)

async def stop_webrtc(context: Context, socket: WebSocket):
    context.session.stop_webrtc(socket)
    await status(context, socket)

async def send_ice(context: Context, socket: WebSocket, params):
    context.session.send_ice(socket, params)
    await status(context, socket)

async def send_sdp(context: Context, socket: WebSocket, params):
    context.session.send_sdp(socket, params)
    await status(context, socket)    

async def video_restart(context: Context, socket: WebSocket, sessionId : str):
    context.session.video_restart(sessionId)
    await status(context, socket)    