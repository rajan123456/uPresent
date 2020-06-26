from geopy.distance import geodesic
import urllib.request
from flask import current_app
import json
import logging
import os


log = logging.getLogger("root")


def validateVicinity(attendanceBody):
    log.info("Inside validate vicinity method for student's attendance")
    management_api = os.getenv("MANAGEMENT_API_GEO_FENCE")
    if management_api is None:
        management_api = current_app.config["MANAGEMENT_API_GEO_FENCE"]
    managementApiResponse = urllib.request.urlopen(
        management_api + attendanceBody.get("school")
    ).read()
    managementResponseData = json.loads(managementApiResponse.decode("utf8")).get(
        "data"
    )
    if managementResponseData is None:
        raise Exception("No data found for School")
    distance = geodesic(
        attendanceBody.get("location"),
        [
            managementResponseData.get("latitude"),
            managementResponseData.get("longitude"),
        ],
    ).m
    log.info("distance calculated: " + str(distance))
    if distance > managementResponseData.get("radiusInMeter"):
        log.info(
            "validate vicinity check failed as distance is "
            + str(distance)
            + " mobile lat long sent : "
            + str(attendanceBody.get("location"))
            + "saved coordinates are : "
            + str(managementResponseData.get("latitude"))
            + str(managementResponseData.get("longitude"))
        )
        raise Exception("Not in the right vicinity")

