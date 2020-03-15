from flask import Response, request
from database.models import Attendance
from flask_restful import Resource
from geopy.distance import geodesic
import urllib.request

class AllAttendanceApi(Resource):
    def get(self):
        allAttendance = Attendance.objects().to_json()
        return Response(allAttendance, mimetype="application/json", status=200)

    def post(self):
        body = request.get_json()
        attendance = Attendance(**body)
        contents = urllib.request.urlopen("http://example.com/foo/bar").read()
        distance = geodesic(body.get("location"),[1.2916417, 103.7753452]).m
        if distance < 1000 :
            attendance.save()
        else:
            raise ValueError("Not in the premise area")
            #return {'error': "Not in the premise area"}, 500
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