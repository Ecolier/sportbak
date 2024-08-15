import sys
from videoapp.video.assembler import Assembler 
from videoapp.uploader.uploader import Uploader 
from .core import config
import logging
logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)

if __name__ == "__main__":
    if (len(sys.argv) >= 2):
        a = Assembler(sys.argv[1])
        a.start()
        #u = Uploader(config.SERVICE_URL, config.USER_ID, config.USER_PWD, "{}/output.mp4".format(sys.argv[1]))
        #u.upload()
    else:  
        print("{} path".format(sys.argv[0]))