
import gi
import shutil
import logging
import time
gi.require_version('Gst', '1.0')
from gi.repository import Gst, GObject
from videoapp.video.capture import Capture, RecordBin, EngineBin

Gst.init(None)

class TestRecordBin:
    def test_record(self):
        
        pipeline = Gst.Pipeline.new('pipeline')
        videotestsrc = Gst.ElementFactory.make('videotestsrc')
        videotestsrc.set_property('num-buffers', 200)
        encoder = Gst.ElementFactory.make('x264enc')
        
        recordbin = RecordBin()
        recordbin.set_property('location', 'output')
        assert recordbin.get_property('location') == 'output'
        
        pipeline.add(videotestsrc)
        pipeline.add(encoder)
        pipeline.add(recordbin)
        videotestsrc.link(encoder)
        encoder.link(recordbin)
    

        pipeline.set_state(Gst.State.PLAYING)
        
        bus  = pipeline.get_bus()
        msg = bus.timed_pop_filtered (Gst.CLOCK_TIME_NONE, 
                            Gst.MessageType.ERROR | Gst.MessageType.EOS)
        
        assert msg.type == Gst.MessageType.EOS
        pipeline.set_state(Gst.State.NULL)
        shutil.rmtree("output")


class TestEngineBin:
    def test_start_record(self):
        pipeline = Gst.Pipeline.new('pipeline')
        videotestsrc = Gst.ElementFactory.make('videotestsrc')
        timeoverlay = Gst.ElementFactory.make('timeoverlay')
        
        videotestsrc.set_property('is-live', True)

        enginebin = EngineBin()
        pipeline.add(videotestsrc)
        pipeline.add(timeoverlay)
        pipeline.add(enginebin)
        videotestsrc.link(timeoverlay)
        timeoverlay.link(enginebin)

        pipeline.set_state(Gst.State.PLAYING)
        
        time.sleep(2)
        enginebin.start_record("output")
        time.sleep(5)
        enginebin.stop_record()

        time.sleep(5)
        enginebin.start_record("output1")
        time.sleep(5)
        enginebin.stop_record()
        time.sleep(2)

        pipeline.set_state(Gst.State.NULL)
        shutil.rmtree("output")
        shutil.rmtree("output1")


class TestCapture:
    def test_capture(self):
        capture = Capture('rtsp://localhost:3000', '', '', 'tests')
        capture.start()
        