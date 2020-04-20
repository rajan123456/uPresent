import urllib.request
from flask import current_app
import json
import logging

log = logging.getLogger('root')

def compare_faces_facenet(targetId, username):
    facenetApiResponse = urllib.request.urlopen(
        current_app.config['FACENET_RECOGNITION_API'] + targetId).read()
    facenetApiData = json.loads(facenetApiResponse.decode('utf8'))
    if facenetApiData is None:
        log.error('No data received from face recgnition service')
        raise Exception('No data found from face recgnition service')
    if facenetApiData.get('username') != username or \
            facenetApiData.get('confidence') < current_app.config['THRESHOLD_CONFIDENCE']:
        log.error('image mismatch found due to low confidence')
        raise Exception('Image mismatch found!')