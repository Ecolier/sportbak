import logging
import uvicorn

if __name__=='__main__':
    uvicorn.run("videoapp.start:app", host="0.0.0.0", port=9000, log_level="info", workers=1)

