import urllib.request
from flask import current_app
import json
import logging
import os


log = logging.getLogger("root")


def check_school_active(schoolCode):
    log.info("Trying to fetch school info by schoolCode")
    school_api = os.getenv("MANAGEMENT_API_SCHOOL")
    if school_api is None:
        school_api = current_app.config["MANAGEMENT_API_SCHOOL"]
    schoolApiResponse = urllib.request.urlopen(school_api + schoolCode).read()
    schoolResponseData = json.loads(schoolApiResponse.decode("utf8")).get("data")
    if schoolResponseData is None:
        log.error("No data found for the schoolCode")
        raise Exception("No data found for the schoolCode")
    return schoolResponseData
