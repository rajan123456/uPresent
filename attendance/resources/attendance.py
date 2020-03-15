from flask import Response, request
from database.models import Attendance
from flask_restful import Resource
from geopy.distance import geodesic
import urllib.request
import json

class AllAttendanceApi(Resource):
    def get(self):
        allAttendance = Attendance.objects().to_json()
        return Response(allAttendance, mimetype="application/json", status=200)

    def post(self):
        body = request.get_json()
        attendance = Attendance(**body)
        apiResponse = urllib.request.urlopen("http://management/manage/geo-fence?universityName="+attendance.school).read()
        responseData = json.loads(apiResponse.decode('utf8')).get("data")
        if responseData is None:
            return {'error': "School does not exist in db"}, 500
        distance = geodesic(body.get("location"),[responseData.get("latitude"), responseData.get("longitude")]).m
        if distance < responseData.get("radiusInMeter") :
            attendance.save()
        else:
            return {'error': "Not in the premise area"}, 500
        return {'id': str(attendance.id)}, 200


class AttendanceApi(Resource):
    def put(self, id):
        body = request.get_json()
        Attendance.objects.get(id=id).update(**body)
        return '', 200

    def delete(self, id):
        movie = Attendance.objects.get(id=id).delete()
        return '', 200

    def get(self, id):
        attendance = Attendance.objects.get(userId=id).to_json()
        return Response(attendance, mimetype="application/json", status=200)