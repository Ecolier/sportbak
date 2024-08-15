import os
import json
import uvicorn
import logging
import asyncio

from fastapi import FastAPI, WebSocket
from fastapi.websockets import WebSocketDisconnect
from starlette.middleware.cors import CORSMiddleware

import gi
gi.require_version('Gst', '1.0')
from gi.repository import Gst
gi.require_version('GstWebRTC', '1.0')
from gi.repository import GstWebRTC
gi.require_version('GstSdp', '1.0')
from gi.repository import GstSdp

Gst.init(None)
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="webrtc.streamer", root_path="/")


class Streamer(object):
    def __init__(self, connection):
        self.connection = connection

        self.pipeline = Gst.Pipeline.new("streamer")
        self.videotestsrc = Gst.ElementFactory.make("videotestsrc")
        self.videotestsrc.set_property("is-live", True)

        self.capsfilter = Gst.ElementFactory.make("capsfilter")

        self.videoconvert = Gst.ElementFactory.make("videoconvert")
        self.videoencoder = Gst.ElementFactory.make("x264enc")
        self.videoencoder.set_property("bitrate", 4096)
        self.videoencoder.set_property("byte-stream", True)
        self.videoencoder.set_property("key-int-max", 30)
        self.videoencoder.set_property("speed-preset", 2)
        self.videoencoder.set_property("tune", 0x00000004)
        
        caps = Gst.Caps.from_string("video/x-raw, width=1920, height=1080, framerate=30/1")
        self.capsfilter.set_property("caps", caps)


        self.videoencoderqueue = Gst.ElementFactory.make("queue")

        self.videopay = Gst.ElementFactory.make("rtph264pay")
        self.videopayqueue = Gst.ElementFactory.make("queue")

        self.webrtc = Gst.ElementFactory.make("webrtcbin")
        self.webrtc.set_property("latency", 1000)

        self.webrtc.set_property("bundle-policy", "max-bundle")
        self.webrtc.set_property("stun-server", "stun://stun.l.google.com:19302")

        self.webrtc.connect('on-negotiation-needed', self.on_negotiation_needed)
        self.webrtc.connect('on-ice-candidate', self.on_ice_candidate)

        self.pipeline.add(self.videotestsrc)
        self.pipeline.add(self.capsfilter)
        self.pipeline.add(self.videoconvert)
        self.pipeline.add(self.videoencoder)
        self.pipeline.add(self.videoencoderqueue)
        self.pipeline.add(self.videopay)
        self.pipeline.add(self.videopayqueue)
        self.pipeline.add(self.webrtc)

        self.videotestsrc.link(self.capsfilter)
        self.capsfilter.link(self.videoconvert)
        self.videoconvert.link(self.videoencoder)
        self.videoencoder.link(self.videoencoderqueue)        
        self.videoencoderqueue.link(self.videopay)        
        self.videopay.link(self.videopayqueue)
        self.videopayqueue.link(self.webrtc)

        self.audiotestsrc = Gst.ElementFactory.make("audiotestsrc")
        self.audiotestsrc.set_property("is-live", True)

        self.audioconvert = Gst.ElementFactory.make("audioconvert")
        self.audioencoder = Gst.ElementFactory.make("opusenc")
        self.audioencoderqueue = Gst.ElementFactory.make("queue")
        self.audiopay = Gst.ElementFactory.make("rtpopuspay")
        self.audiopayqueue = Gst.ElementFactory.make("queue")

        self.pipeline.add(self.audiotestsrc)
        self.pipeline.add(self.audioconvert)
        self.pipeline.add(self.audioencoder)
        self.pipeline.add(self.audioencoderqueue)
        self.pipeline.add(self.audiopay)
        self.pipeline.add(self.audiopayqueue)


        self.audiotestsrc.link(self.audioconvert)
        self.audioconvert.link(self.audioencoder)
        self.audioencoder.link(self.audioencoderqueue)        
        self.audioencoderqueue.link(self.audiopay)        
        self.audiopay.link(self.audiopayqueue)
        self.audiopayqueue.link(self.webrtc)


    def on_negotiation_needed(self, element):

        promise = Gst.Promise.new_with_change_func(self.on_offer_created, element, None)
        element.emit('create-offer', None, promise)


    def on_ice_candidate(self, _, mlineindex, candidate):
        icemsg = json.dumps({'ice': {'candidate': candidate, 'sdpMLineIndex': mlineindex}})
        loop = asyncio.new_event_loop()
        loop.run_until_complete(self.connection.send_text(icemsg))
        loop.close()

    def on_offer_created(self, promise, _, __):
        promise.wait()
        reply = promise.get_reply()
        offer = reply.get_value('offer')
        promise = Gst.Promise.new()
        self.webrtc.emit('set-local-description', offer, promise)
        promise.interrupt()
        self.send_sdp_offer(offer)

    
    
    def send_sdp_offer(self, offer):
        text = offer.sdp.as_text()
        print ('Sending offer:\n%s' % text)
        msg = json.dumps({'sdp': {'type': 'offer', 'sdp': text}})
        loop = asyncio.new_event_loop()
        loop.run_until_complete(self.connection.send_text(msg))
        loop.close()
    
    def play(self):
        self.pipeline.set_state(Gst.State.PLAYING)
    
    def handle_sdp(self, message):
        assert (self.webrtc)
        msg = json.loads(message)
        if 'sdp' in msg:
            sdp = msg['sdp']
            assert(sdp['type'] == 'answer')
            sdp = sdp['sdp']
            print ('Received answer:\n%s' % sdp)
            res, sdpmsg = GstSdp.SDPMessage.new()
            GstSdp.sdp_message_parse_buffer(bytes(sdp.encode()), sdpmsg)
            answer = GstWebRTC.WebRTCSessionDescription.new(GstWebRTC.WebRTCSDPType.ANSWER, sdpmsg)
            promise = Gst.Promise.new()
            self.webrtc.emit('set-remote-description', answer, promise)
            promise.interrupt()
            print("SDP")
        elif 'ice' in msg:
            ice = msg['ice']
            candidate = ice['candidate']
            sdpmlineindex = ice['sdpMLineIndex']
            self.webrtc.emit('add-ice-candidate', sdpmlineindex, candidate)
            print("ICE")


    def stop(self):
        self.pipeline.set_state(Gst.State.NULL)
        self.pipeline = None
        self.webrtc = None
    
@app.websocket("/")
async def websocket_endpoint(websocket: WebSocket):     
    streamer = None
    try:
        await websocket.accept()
        streamer = Streamer(websocket)
        streamer.play()
        while True:
            data = await websocket.receive_text()
            streamer.handle_sdp(data)
            print(data)
    except WebSocketDisconnect:
        if streamer:
            streamer.stop()
            streamer = None


if __name__=='__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=9000, log_level="info")
