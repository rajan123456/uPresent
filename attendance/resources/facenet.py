import urllib.request
from flask import current_app
import json
import logging
import os


log = logging.getLogger("root")


def compare_faces_facenet(targetId, username):
    log.info(
        "Trying to compare faces for student attendance with FaceNet for username ---->>"
        + username
    )
    facenet_api = os.getenv("FACENET_RECOGNITION_API")
    if facenet_api is None:
        facenet_api = current_app.config["FACENET_RECOGNITION_API"]
    facenetApiResponse = urllib.request.urlopen(facenet_api + targetId).read()
    facenetApiData = json.loads(facenetApiResponse.decode("utf8"))
    if facenetApiData is None:
        log.error("No data received from face recgnition service")
        raise Exception("No data found from face recgnition service")
    else:
        log.info(
            "Facial recognition with FaceNet username and confidence rating is "
            + facenetApiData.get("username")
            + " "
            + str(facenetApiData.get("confidence"))
        )
    if (
        facenetApiData.get("username") != username
        or facenetApiData.get("confidence") < current_app.config["THRESHOLD_CONFIDENCE"]
    ):
        log.error("image mismatch found due to low confidence or username")
        raise Exception("Image mismatch found!")
    else:
        return str(facenetApiData.get("confidence"))
