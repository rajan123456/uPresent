from flask import Response, request
from database.models import Attendance
from flask_restful import Resource
from resources.rekognition import compare_faces
from resources.geofence import validateVicinity
from resources.user import fetchUser

class AllAttendanceApi(Resource):
    def get(self):
        allAttendance = Attendance.objects().to_json()
        return Response(allAttendance, mimetype="application/json", status=200)

    def post(self):
        body = request.get_json()
        attendance = Attendance(**body)
        validateVicinity(body)
        user = fetchUser(attendance.username)
        compare_faces(attendance.capturedImageId, user.get('imageId').get(0))
        attendance.save()
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