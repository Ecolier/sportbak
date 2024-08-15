import gi
import logging
gi.require_version('Gst', '1.0')
from gi.repository import Gst, GObject, GLib
import os
import shutil
import time
import datetime
import time
from threading import Thread
from PIL import ImageFont
from math import floor
import uuid
import asyncio
import math
from threading import Thread, Lock

gi.require_version('GstWebRTC', '1.0')
from gi.repository import GstWebRTC

gi.require_version('GstSdp', '1.0')
from gi.repository import GstSdp

Gst.init(None)

DEFAULT_STREAMING_LOCATION = 'movie.mp4'

class MatchScheduler:
    def __init__(self, scorer, match):
        self.scorer = scorer
        self.currentTime = 0
        self.stopped = True
        self.reseted = False
        self.thread = Thread(target=self._loop)
        self.thread.start()
        self.paused = False

        
    def _loop(self):
        while (True):
            if not self.stopped:
                if self.reseted:
                    self.currentTime = -1
                    self.reseted = False
                if not self.paused:
                    self.currentTime = self.currentTime + 1
                    minutes = math.floor(self.currentTime/60)
                    if (minutes < 10):
                        minutes = "0{}".format(minutes)
                    seconds = self.currentTime%60
                    if (seconds < 10):
                        seconds = "0{}".format(seconds)                

                    final_time = "{}:{}".format(minutes, seconds)
                    self.scorer.time.set_property("text", final_time)
                
            time.sleep(1)

    def start(self):
        self.stopped = False
        self.reseted = True

    def restart(self):
        self.paused = False

    def reset(self):
        self.reseted = True

    def pause(self):
        self.paused = True

    def stop(self):
        self.stopped = True

    def set_time(self, time):
        self.currentTime = time
        
class Scorer(Gst.Bin):
    __gstmetadata__ = ('Scorer Bin', 'Scorer', \
                      'Scorer Bin Element', 'Ludovic Bouguerra')


    def __init__(self, name = None):
        Gst.Bin.__init__(self, name=name)
        self.m = MatchScheduler(self, {})
        self.font_14 = ImageFont.truetype('/usr/local/share/fonts/big_noodle_titling.ttf', 28)
        self.font_7 = ImageFont.truetype('/usr/local/share/fonts/big_noodle_titling.ttf', 16)
        
        self.overlay = Gst.ElementFactory.make("gdkpixbufoverlay")
        self.overlay.set_property("location", "overlay.png")
        self.overlay.set_property("overlay-width", 600) 
        self.overlay.set_property("overlay-height", 144)
        self.overlay.set_property("offset-x", 660)
        self.overlay.set_property("offset-y", 900)
        self.overlay.set_property("alpha", 0)

        self.logo = Gst.ElementFactory.make("gdkpixbufoverlay")
        self.logo.set_property("overlay-width", 772) 
        self.logo.set_property("overlay-height", 192)
        self.logo.set_property("offset-x", 30)
        self.logo.set_property("offset-y", 20)
        self.logo.set_property("location", "scorer.png") 
        self.logo.set_property("alpha", 0)
        
        self.score = Gst.ElementFactory.make("textoverlay")
        self.score.set_property("valignment", 2)
        self.score.set_property("halignment", 0)
        self.score.set_property("draw-outline", False)
        self.score.set_property("font-desc", "BigNoodleTitling 14")
        self.score.set_property("text", "")
        self.score.set_property("draw-shadow", False)
        self.score.set_property("xpad", 375)
        self.score.set_property("ypad", 35)

        self.team1 = Gst.ElementFactory.make("textoverlay")
        self.team1.set_property("valignment", 2)
        self.team1.set_property("halignment", 0)
        self.team1.set_property("draw-outline", False)
        self.team1.set_property("font-desc", "BigNoodleTitling 14")
        self.team1.set_property("draw-shadow", False)
        self.team1.set_property("text", "")
        self.team1.set_property("xpad", 80)
        self.team1.set_property("ypad", 35)


        self.team2 = Gst.ElementFactory.make('textoverlay')
        self.team2.set_property("valignment", 2)
        self.team2.set_property("halignment", 0)
        self.team2.set_property("draw-outline", False)
        self.team2.set_property("font-desc", "BigNoodleTitling 14")
        self.team2.set_property("draw-shadow", False)
        self.team2.set_property("text", "")
        self.team2.set_property("xpad", 610)
        self.team2.set_property("ypad", 35)

        self.time = Gst.ElementFactory.make('textoverlay')
        self.time.set_property("valignment", 2)
        self.time.set_property("halignment", 0)
        self.time.set_property("draw-outline", False)
        self.time.set_property("font-desc", "BigNoodleTitling 14")
        self.time.set_property("draw-shadow", False)
        self.time.set_property("text", "")
        self.time.set_property("xpad", 360)
        self.time.set_property("ypad", 125)       
        self.time.set_property("color", 0xFF000000) 
        self.time.set_property("xpad", 30 + 275 + 110 - 45)

        self.period = Gst.ElementFactory.make('textoverlay')
        self.period.set_property("valignment", 2)
        self.period.set_property("halignment", 0)
        self.period.set_property("draw-outline", False)
        self.period.set_property("font-desc", "BigNoodleTitling 7")
        self.period.set_property("draw-shadow", False)
        self.period.set_property("text", "")
        self.period.set_property("xpad", 340)
        self.period.set_property("ypad", 180)       
        self.period.set_property("color", 0xFF000000)         

        self.add(self.overlay)
        self.add(self.logo)
        self.add(self.score)
        self.add(self.team1)
        self.add(self.team2)
        self.add(self.time)
        self.add(self.period)

        self.overlay.link(self.logo)
        self.logo.link(self.score)
        self.score.link(self.team1)
        self.team1.link(self.team2)
        self.team2.link(self.time)
        self.time.link(self.period)

        sink = self.overlay.get_static_pad('sink')
        pad = Gst.GhostPad.new('sink', sink)
        self.add_pad(pad)

        src = self.period.get_static_pad('src')
        pad = Gst.GhostPad.new('src', src)
        self.add_pad(pad)
        
    def start(self):
        self.m.start()

    def set_score(self, team_1, team_2):
        score = "{} - {}".format(team_1, team_2)
        width, height = self.font_14.getmask(score).size
        self.score.set_property("xpad", 30 + 275 + 110 - floor(width))
        self.score.set_property("text", score)

    def set_teams(self, team_1, team_2):
        width, height = self.font_14.getmask(team_1).size
        self.team1.set_property("xpad", 30 + 137 - floor(width))
        self.team1.set_property("text", team_1)

        width, height = self.font_14.getmask(team_2).size
        self.team2.set_property("xpad", 30 + 275 + 222 + 137 - floor(width))        
        self.team2.set_property("text", team_2)
    
    def switch_period(self, name):
        width, height = self.font_7.getmask(name).size
        self.period.set_property("xpad", 30 + 275 + 115 - floor(width))
        self.period.set_property("text", name)
        self.m.reset()

    def pause(self):
        self.m.pause()
    
    def restart(self):
        self.m.restart()        
        
    def stop(self):
        self.m.stop()

    def set_time(self, time):
        self.m.set_time(time)

class LiveStreamingBin(Gst.Bin):
    __gstmetadata__ = ('LiveStreaming Bin', 'LiveStreaming', \
                      'Livestreaming Bin Element', 'Ludovic Bouguerra')

    __gproperties__ = {
        'location': (str,
                 'Location',
                 'Record Location',
                 DEFAULT_STREAMING_LOCATION,
                 GObject.ParamFlags.READWRITE
                )
    }

    def __init__(self, name = None):
        Gst.Bin.__init__(self, name=name)
        self.location = DEFAULT_RECORD_LOCATION
        self.vqueue = Gst.ElementFactory.make('queue')
        self.hlssink2 = Gst.ElementFactory.make('hlssink2', 'sink')
        
        self.hlssink2.set_property('playlist-length', 0)
        self.hlssink2.set_property('max-files', 0)
        self.hlssink2.set_property('target-duration', 2)

        self.add(self.vqueue)
        self.add(self.hlssink2)


    def do_get_property(self, prop):
        if prop.name == 'location':
            return self.location
        else:
            raise AttributeError('unknown property %s' % prop.name)

    def do_set_property(self, prop, value):
        if prop.name == 'location':
            self.location = value
        else:
            raise AttributeError('unknown property %s' % prop.name)


DEFAULT_RECORD_LOCATION = 'playlist'

class RecordBin(Gst.Bin):
    __gstmetadata__ = ('RecordBin','RecordBin', \
                      'Record Bin Element', 'Ludovic Bouguerra')

    __gproperties__ = {
        'location': (str,
                 'Location',
                 'Record Location',
                 DEFAULT_RECORD_LOCATION,
                 GObject.ParamFlags.READWRITE
                )
    }

    def __init__(self, name = None):
        Gst.Bin.__init__(self, name=name)
        self.location = DEFAULT_RECORD_LOCATION
        self.vqueue = Gst.ElementFactory.make('queue')
        self.parse = Gst.ElementFactory.make('h264parse', 'parse')
        self.hlssink2 = Gst.ElementFactory.make('hlssink2', 'sink')
        
        self.hlssink2.set_property('playlist-length', 0)
        self.hlssink2.set_property('max-files', 0)
        self.hlssink2.set_property('target-duration', 2)

        self.add(self.vqueue)
        self.add(self.parse)
        self.add(self.hlssink2)
        self.vqueue.link(self.parse)
        self.parse.link_pads('src', self.hlssink2, 'video')

        sink = self.vqueue.get_static_pad('sink')
        pad = Gst.GhostPad.new('sink', sink)
        self.add_pad(pad)

    def do_get_property(self, prop):
        if prop.name == 'location':
            return self.location
        else:
            raise AttributeError('unknown property %s' % prop.name)

    def do_set_property(self, prop, value):
        if prop.name == 'location':
            self.location = value
            os.makedirs(self.location, exist_ok=True)
            self.hlssink2.set_property('location', '{}/segment%05d.ts'.format(value))
            self.hlssink2.set_property('playlist-location', '{}/playlist.m3u8'.format(value))
        else:
            raise AttributeError('unknown property %s' % prop.name)


class EngineBin(Gst.Bin):
    __gstmetadata__ = ('EngineBin','EngineBin', \
                       'Engine Bin Element', 'Ludovic Bouguerra')

    def __init__(self, name = None, encoder= 'x264'):
        Gst.Bin.__init__(self, name=name)
        self.webrtcbins = {}

        
        #self.scorer = Scorer()
        if encoder == 'x264':
            self.encoder = Gst.ElementFactory.make('x264enc')
            self.encoder.set_property('bitrate', 4000)
            self.encoder.set_property('speed-preset', 2)
            self.encoder.set_property('tune', 0x00000004)
            self.encoder.set_property('key-int-max', 2)
        elif encoder == 'vaapi':
            self.encoder = Gst.ElementFactory.make('vaapih264enc')
            self.encoder.set_property('bitrate', 4000)
            #self.encoder.set_property('keyframe-period', 25) 
            self.encoder.set_property('rate-control', 2)
        else:
            raise Exception('Unknown encoder exception')

        self.vqueue = Gst.ElementFactory.make('queue')
        self.venctee = Gst.ElementFactory.make('tee')
        self.venctee.set_property('allow-not-linked', True)
        caps = Gst.Caps.from_string("video/x-h264, profile=constrained-baseline, level=(string)4, framerate=(fraction)25/1")
        self.vencfilter = Gst.ElementFactory.make('capsfilter')
        self.vencfilter.set_property("caps", caps)
        self.vencqueue = Gst.ElementFactory.make('queue')
        self.record = RecordBin()
        self.record.set_locked_state(True)
        self.valve = Gst.ElementFactory.make('valve')


        #self.add(self.scorer)
        self.add(self.vqueue)
        self.add(self.encoder)
        self.add(self.vencfilter)
        self.add(self.vencqueue)
        self.add(self.venctee)
        self.add(self.record)
        self.add(self.valve)

        #self.vqueue.link(self.scorer)
        self.vqueue.link(self.encoder)
        self.encoder.link(self.vencfilter)
        self.vencfilter.link(self.vencqueue)
        self.vencqueue.link(self.venctee)
        self.venctee.link(self.valve)
        self.valve.link(self.record)
        self.valve.set_property("drop", True)

        sink = self.vqueue.get_static_pad('sink')
        pad = Gst.GhostPad.new('sink', sink)
        self.add_pad(pad)

    def is_recording(self):
        return not self.valve.get_property('drop')

    def start_webrtc(self, connection):
        stream_id = str(uuid.uuid4())
        if (id(connection) in self.webrtcbins):
            self.stop_webrtc(connection)

        self.webrtcbins[id(connection)] = WebRTC(connection=connection, client_id=str(stream_id))
        self.add(self.webrtcbins[id(connection)])
        self.webrtcbins[id(connection)].sync_state_with_parent()
        self.venctee.link(self.webrtcbins[id(connection)])


    def stop_webrtc(self, connection):
        if (id(connection) in self.webrtcbins):
            self.venctee.unlink(self.webrtcbins[id(connection)])
            self.webrtcbins[id(connection)].set_state(Gst.State.NULL)
            del self.webrtcbins[id(connection)]


    def send_sdp(self, socket, sdp):
        self.webrtcbins[id(socket)].handle_sdp(sdp)

    def send_ice(self, socket, ice):
        self.webrtcbins[id(socket)].handle_ice(ice)

    def start_record(self, destination):
        self.record.set_property('location', destination)
        self.record.set_locked_state(False)
        self.record.set_state(Gst.State.PLAYING)
        self.valve.set_property("drop", False)
        structure = Gst.Structure.new_from_string("GstForceKeyUnit, all-headers=true")
        self.encoder.get_static_pad("sink").send_event(Gst.Event.new_custom(Gst.EventType.CUSTOM_DOWNSTREAM, structure))

        #self.scorer.start()
    
    def set_teams(self, team_1, team_2):
        self.scorer.set_teams(team_1, team_2)

    def set_score(self, team_1, team_2):
        self.scorer.set_score(team_1, team_2)

    def switch_period(self, name):
        self.scorer.switch_period(name)

    def pause_time(self):
        self.scorer.pause()
    
    def restart_time(self):
        self.scorer.restart()

    def set_time(self, time):
        self.scorer.set_time(time)

    def stop_record(self):
        self.valve.set_property("drop", True)
        self.record.set_state(Gst.State.NULL)
        

    def restart_record(self, destination):
        print("TODO - restart_record")
        # TODO - Is copy - past from start_record. Need to change 
        #if self.record == None:
        #    self.record = RecordBin()
        #    self.record.set_property('location', destination)
        #    self.add(self.record)
        #    self.record.sync_state_with_parent()
        #    self.venctee.link(self.record)
        #    self.scorer.start()

GObject.type_register(LiveStreamingBin)
GObject.type_register(RecordBin)
GObject.type_register(EngineBin)

__gstelementfactory__ = (('livestreamingbin', Gst.Rank.NONE, LiveStreamingBin), ('recordbin', Gst.Rank.NONE, RecordBin), ('enginebin', Gst.Rank.NONE, EngineBin))

class WebRTC(Gst.Bin):
    __gstmetadata__ = ('WebRTCBin','WebRTCBin', \
                       'WebRTC Bin Element', 'Ludovic Bouguerra')

    def __init__(self, name = None, connection = None, client_id = None):
        Gst.Bin.__init__(self, name=name)
        self.connection = connection
        self.client_id = client_id

        self.vqueue = Gst.ElementFactory.make('queue')
        self.vqueue.set_property('leaky', 'downstream')
        self.vqueue.set_property('silent', True)
        
        self.parser = Gst.ElementFactory.make('h264parse')
        self.vpay = Gst.ElementFactory.make("rtph264pay")
        self.payqueue = Gst.ElementFactory.make("queue")
        self.webrtc = Gst.ElementFactory.make("webrtcbin")

        #self.webrtc.set_property("bundle-policy", "max-bundle")
        self.webrtc.set_property("stun-server", "stun://stun.l.google.com:19302")

        self.webrtc.connect('on-negotiation-needed', self.on_negotiation_needed)
        self.webrtc.connect('on-ice-candidate', self.on_ice_candidate)
        self.webrtc.connect('notify::connection-state', self.on_connection_state)
        self.webrtc.connect('notify::ice-connection-state', self.on_ice_connection_state)
        self.webrtc.connect('notify::ice-gathering-state', self.on_ice_gathering_state)
        self.webrtc.connect('notify::signaling-state', self.on_signaling_state)

        self.add(self.vqueue)
        self.add(self.parser)
        self.add(self.vpay)
        self.add(self.payqueue)
        self.add(self.webrtc)
        self.vqueue.link(self.parser)
        self.parser.link(self.vpay)
        self.vpay.link(self.payqueue)        
        self.payqueue.link(self.webrtc)

        sink = self.vqueue.get_static_pad('sink')
        pad = Gst.GhostPad.new('sink', sink)
        self.add_pad(pad)

    def on_connection_state(self, element, params):
        print(self.webrtc.get_property("connection-state"))

    def on_ice_connection_state(self, element, params):
        print(self.webrtc.get_property("ice-connection-state"))
    
    def on_ice_gathering_state(self, element, params):
        print(self.webrtc.get_property("ice-gathering-state"))        

    def on_signaling_state(self, element, params):
        print(self.webrtc.get_property("signaling-state"))        

    def on_negotiation_needed(self, element):
        promise = Gst.Promise.new_with_change_func(self.on_offer_created, element, None)
        element.emit('create-offer', None, promise)

    def on_ice_candidate(self, _, mlineindex, candidate):
        loop = asyncio.new_event_loop()
        loop.run_until_complete(self.connection.send_json({'action' : 'ice', 'params': {"id": self.client_id, "ice": {'candidate': candidate, 'sdpMLineIndex': mlineindex}}}))
        
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
        loop = asyncio.new_event_loop()
        loop.run_until_complete(self.connection.send_json({'action' : 'sdp', 'params': {"id": self.client_id, "sdp" : { "type": "offer", "sdp": text}}}))        
    
    def handle_ice(self, ice):
            candidate = ice['candidate']
            if candidate:
                sdpmlineindex = ice['sdpMLineIndex']
                self.webrtc.emit('add-ice-candidate', sdpmlineindex, candidate)

    def handle_sdp(self, sdp):
            assert(sdp['type'] == 'answer')
            res, sdpmsg = GstSdp.SDPMessage.new()
            GstSdp.sdp_message_parse_buffer(bytes(sdp['sdp'].encode()), sdpmsg)
            answer = GstWebRTC.WebRTCSessionDescription.new(GstWebRTC.WebRTCSDPType.ANSWER, sdpmsg)
            promise = Gst.Promise.new()
            self.webrtc.emit('set-remote-description', answer, promise)
            promise.interrupt()

GObject.type_register(WebRTC)


class Capture:
    def __init__(self, camera_url, camera_user, camera_pwd, destination, encoder = 'x264'):
        logging.info('{} {}'.format(camera_user, camera_pwd))
        self.camera_url = camera_url
        self.camera_user = camera_user
        self.camera_pwd = camera_pwd
        self.ready = False
        self.error = False
        self.last_error = ''
        self.encoder = encoder

    def _build_pipeline(self):
        self.pipeline = Gst.Pipeline.new('capture')
        self.rtspsrc = Gst.ElementFactory.make('rtspsrc', 'src')
        self.rtspsrc.set_property('location', self.camera_url)
        self.rtspsrc.set_property('user-id', self.camera_user)
        self.rtspsrc.set_property('user-pw', self.camera_pwd)
        self.enginebin = EngineBin(encoder=self.encoder)
        self.rtpjitterbuffer = Gst.ElementFactory.make('rtpjitterbuffer')
        self.rtpjitterbuffer.set_property("mode", 4)
        self.rtpdepay = Gst.ElementFactory.make('rtph264depay')
        self.h264parse = Gst.ElementFactory.make('h264parse')
        self.h264dec = None
        if self.encoder == 'vaapi':
          self.h264dec = Gst.ElementFactory.make('vaapih264dec')
        elif self.encoder == 'x264':
          self.h264dec = Gst.ElementFactory.make('avdec_h264')

        self.rtspsrc.connect('pad-added', self._rtsp_pad_added)
        self.pipeline.add(self.rtspsrc)

    def _close_pipeline(self):
        self.pipeline = None

    def _rtsp_pad_added(self, rtspsrc, rtsp_pad):
        caps = rtsp_pad.get_current_caps()
        logging.info('rtsp src pad added with template {} and caps {}'.format(rtsp_pad.get_property('template').name_template, caps.to_string()))
        rtpjitter_pad = self.rtpjitterbuffer.get_static_pad('sink')

        self.pipeline.add(self.rtpjitterbuffer)
        self.pipeline.add(self.rtpdepay)
        self.pipeline.add(self.h264parse)
        self.pipeline.add(self.h264dec)
        self.pipeline.add(self.enginebin)

        self.rtpjitterbuffer.sync_state_with_parent()
        self.rtpdepay.sync_state_with_parent()
        self.h264parse.sync_state_with_parent()
        self.h264dec.sync_state_with_parent()
        self.enginebin.sync_state_with_parent()

        rtsp_pad.link(rtpjitter_pad)
        self.rtpjitterbuffer.link(self.rtpdepay)
        self.rtpdepay.link(self.h264parse)
        self.h264parse.link(self.h264dec)
        self.h264dec.link(self.enginebin)
        self.ready = True

    def is_recording(self):
        return self.enginebin.is_recording()

    def _on_eos(self, bus, message):
        self.stop()
        time.sleep(2)
        self.start()

    def _on_error(self, bus, message):
        error = message.parse_error()
        logging.error(error)
        self.stop()
        self.ready = False
        self.error = True
        self.last_error = error[1]
        time.sleep(2)
        self.start()
        print("Error occured : {} ".format(self.last_error))
        
    def on_state_changed(self, bus, msg):
        old, new, pending = msg.parse_state_changed()
        if not msg.src == self.pipeline:
            return

        self.state = new

        print("Pipeline state changed from {0} to {1}".format(
            Gst.Element.state_get_name(old), Gst.Element.state_get_name(new)))


    def start(self):
        logging.info('Starting pipeline')   
        self._build_pipeline()
        self.bus = self.pipeline.get_bus()
        self.bus.add_signal_watch()
        self.bus.connect('message::eos', self._on_eos)
        self.bus.connect('message::state-changed', self.on_state_changed)
        self.bus.connect('message::error', self._on_error) 
        self.pipeline.set_state(Gst.State.PLAYING)

    def start_record(self, destination):
        self.enginebin.start_record(destination)

    def start_webrtc(self, socket):
        return self.enginebin.start_webrtc(socket)

    def send_ice(self, socket, ice):
        return self.enginebin.send_ice(socket, ice)

    def send_sdp(self, socket, sdp):
        return self.enginebin.send_sdp(socket, sdp)

    def stop_webrtc(self, socket):
        self.enginebin.stop_webrtc(socket)

    def stop_record(self):
        self.enginebin.stop_record()

    def set_teams(self, team_1, team_2):
        #self.enginebin.set_teams(team_1, team_2)
        pass

    def set_score(self, team_1, team_2):
        #self.enginebin.set_score(team_1, team_2)
        pass

    def switch_period(self, name):
        #self.enginebin.switch_period(name)
        pass

    def pause_time(self):
        #self.enginebin.pause_time()
        pass
    
    def restart_time(self):
        #self.enginebin.restart_time()
        pass

    def set_time(self, time):
        self.enginebin.set_time(time)

    def stop(self):
        self.pipeline.set_state(Gst.State.NULL)
        self.pipeline = None

    def restart_record(self, destination):
        self.enginebin.restart_record(destination)

