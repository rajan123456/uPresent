import urllib.request
from flask import current_app
import json


def compare_faces_facenet(targetId, username):
    facenetApiResponse = urllib.request.urlopen(
        current_app.config['USER_API_FETCH_USER'] + targetId).read()
    facenetApiData = json.loads(facenetApiResponse.decode('utf8'))
    if facenetApiData is None:
        raise Exception('No data found from facenet')
    if facenetApiData.get('username') != username or \
            facenetApiData.get('confidence') < current_app.config['THRESHOLD_CONFIDENCE']:
        raise Exception('Image mismatch found!')