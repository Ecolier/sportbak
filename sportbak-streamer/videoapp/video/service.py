import os
import logging
from .capture import Capture
from datetime import datetime

class SessionService:
    def __init__(self, camera_url, camera_user, camera_pwd, destination, encoder):
        self.current_session = Capture(camera_url, camera_user, camera_pwd, destination, encoder)
        self.session_name = ''
        self.destination = destination
        self.recording = False
        self.current_session.start()


    def start(self):
        self.session_name = datetime.now().strftime("%Y_%m_%d_%H_%M_%S")
        destination = os.path.join(self.destination, self.session_name)
        self.current_session.start_record(destination)
        self.recording = True

    def start_webrtc(self, socket):
        self.current_session.start_webrtc(socket)
    
    def stop_webrtc(self, socket):
        self.current_session.stop_webrtc(socket)        

    def send_sdp(self, socket, sdp):
        self.current_session.send_sdp(socket, sdp)
    
    def send_ice(self, socket, ice):
        self.current_session.send_ice(socket, ice)      

    def set_teams(self, team_1, team_2):
        self.current_session.set_teams(team_1, team_2)

    def set_score(self, team_1, team_2):
        self.current_session.set_score(team_1, team_2)

    def switch_period(self, name):
        self.current_session.switch_period(name)

    def pause_time(self):
        self.current_session.pause_time()
    
    def restart_time(self):
        self.current_session.restart_time()
    
    def set_time(self, time):
        self.current_session.set_time(time)

    def stop(self):
        self.current_session.stop_record()
        self.recording = False
        self.session_name = ''
    
    def status(self):
        return {
            'ready': self.current_session.ready,
            'error': self.current_session.error,
            'recording': self.current_session.is_recording(),
            'session_name': self.session_name,
            'last_error': self.current_session.last_error
        }
    
    def video_restart(self, sessionId):
        destination = os.path.join(self.destination, self.session_name)
        self.current_session.restart_record(destination)
        self.recording = True
        self.session_name = sessionId

        
