import hashlib
import requests
import os
import math
import logging

class Uploader:
    def __init__(self, service_url, api_key, api_secret, file, max_byte_length=1000000, retry_timeout=2):
        self.file = file
        self.api_key = api_key
        self.api_secret = api_secret
        self.service_url = service_url
        self.max_byte_length = max_byte_length
        self.retry_timeout = retry_timeout

    def upload(self):
        file_size = os.path.getsize(self.file)

        result = requests.post(self.service_url, headers={"X-APIKEY": self.api_key, "X-APISECRET":self.api_secret})
        if (result.status_code == 200):
            upload_id = result.json()["_id"]
            with open(self.file, 'rb') as f:
                start = 0
                chunk_count = math.ceil(float(file_size) / self.max_byte_length)
                logging.debug("Total chunk count: {}".format(chunk_count))
                sent_chunk_count = 0
                while True:
                    end = min(file_size, start + self.max_byte_length)
                    f.seek(start)
                    data = f.read(self.max_byte_length)
                    try:
                        response = requests.post("{}/{}".format(self.service_url, upload_id), data=data, headers={"X-APIKEY": self.api_key, "X-APISECRET":self.api_secret, 'Content-Type': 'application/octet-stream', 'Range': 'bytes={}-{}/{}'.format(start, end, file_size)})
                        if response.ok:
                            logging.debug('{}. chunk sent to server'.format(sent_chunk_count + 1))
                            sent_chunk_count += 1
                            start = end

                    except requests.exceptions.RequestException:
                        logging.info('Error while sending chunk to server. Retrying in {} seconds'.format(retry_timeout))
                        time.sleep(self.retry_timeout)

                    
                    if sent_chunk_count >= chunk_count:
                        return True
        else: 
            raise Exception("Can't start upload status code {}".format(result.status_code))
