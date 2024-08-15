#!/usr/bin/env python

# WS client example

import asyncio
import websockets
import json

async def start_record():
    uri = "ws://localhost:9000"
    async with websockets.connect(uri) as websocket:
        print(await websocket.recv())
        await websocket.send(json.dumps({'action' : 'stop'}))
        print(await websocket.recv())

asyncio.get_event_loop().run_until_complete(start_record())
