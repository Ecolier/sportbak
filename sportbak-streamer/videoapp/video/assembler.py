
import gi
import logging
gi.require_version('Gst', '1.0')
from gi.repository import Gst, GObject

Gst.init(None)

class Assembler:
    def __init__(self, path):
        self.pipeline = Gst.parse_launch("splitfilesrc location={}/*.ts ! tsdemux ! h264parse ! mp4mux ! filesink location={}/output.mp4".format(path, path))
        self._last_error = None

    def _on_eos(self, bus, message):
        self.mainloop.quit()

    def _on_error(self, bus, message):
        self._last_error = message.parse_error()
        self.mainloop.quit()
    
    def start(self):
        self.bus = self.pipeline.get_bus()
        self.bus.add_signal_watch()
        self.bus.connect("message::eos", self._on_eos)
        self.bus.connect("message::error", self._on_error) 
        self.pipeline.set_state(Gst.State.PLAYING)
        self.mainloop = GObject.MainLoop()
        self.mainloop.run()
        if (self._last_error):
            raise Exception(self._last_error)