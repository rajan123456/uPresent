from geopy.distance import geodesic
import urllib.request
from flask import current_app
import json


def validateVicinity(attendanceBody):
    managementApiResponse = urllib.request.urlopen(
        current_app.config['MANAGEMENT_API_GEO_FENCE'] + attendanceBody.get("school")).read()
    managementResponseData = json.loads(managementApiResponse.decode('utf8')).get("data")
    if managementResponseData is None:
        raise Exception('No data found for School')
    distance = geodesic(attendanceBody.get("location"),
                        [managementResponseData.get("latitude"), managementResponseData.get("longitude")]).m
    if distance > managementResponseData.get("radiusInMeter"):
        raise Exception('Not in the right vicinity')