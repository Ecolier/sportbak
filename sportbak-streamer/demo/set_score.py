#!/usr/bin/env python

# WS client example

import asyncio
import websockets
import json

async def start_record():
    uri = "ws://localhost:9000"
    async with websockets.connect(uri) as websocket:
        print(await websocket.recv())
        await websocket.send(json.dumps({'action' : 'set_score', 'params': { 'team_1': 1, 'team_2': 5 }}))
        await websocket.send(json.dumps({'action' : 'set_teams', 'params': { 'team_1': 'EQUIPE 36 AAAA', 'team_2': 'EQUIPE 36 AAAA' }}))
        print(await websocket.recv())

asyncio.get_event_loop().run_until_complete(start_record())
