import gi
import logging
gi.require_version('Gst', '1.0')
gi.require_version('GstRtspServer', '1.0')
from gi.repository import Gst, GstRtspServer, GLib



class MyFactory(GstRtspServer.RTSPMediaFactory):
    def __init__(self):
        GstRtspServer.RTSPMediaFactory.__init__(self)

    def do_create_element(self, url):
        s_src = "videotestsrc ! timeoverlay ! video/x-raw,framerate=25/1,width=1920,height=1080,format=I420"
        s_h264 = "x264enc tune=zerolatency bitrate=5000"
        pipeline_str = "( {} ! queue max-size-buffers=1 name=q_enc ! {} ! rtph264pay name=pay0 pt=96 )".format(s_src, s_h264)

        return Gst.parse_launch(pipeline_str)


class Emulator:
    def __init__(self, port, path):
        self.server = GstRtspServer.RTSPServer()
        self.server.set_property("service", "{}".format(port))
        f = MyFactory()
        f.set_shared(True)
        m = self.server.get_mount_points()
        m.add_factory(path, f)


    def start(self):
        self.server.attach(None)

if __name__=="__main__":
    loop = GLib.MainLoop()
    Gst.init(None)
    
    e = Emulator(8554, "/streaming/channels/101")
    e.start()
    loop.run()
