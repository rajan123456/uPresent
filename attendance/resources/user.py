import urllib.request
from flask import current_app
import json
import logging

# set logging level for 'video Processor'
log = logging.getLogger('root')


def fetchUser(username):
    log.info("Trying to fetch user info by username ---->>")
    userApiResponse = urllib.request.urlopen(
        current_app.config['USER_API_FETCH_USER'] + username).read()
    userResponseData = json.loads(userApiResponse.decode('utf8')).get("data")
    if userResponseData is None:
        raise Exception('No data found for User')
    return userResponseData