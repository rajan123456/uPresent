from flask import Response, request
from database.models import Attendance
from flask_restful import Resource


class AllAttendanceApi(Resource):
    def get(self):
        allAttendance = Attendance.objects().to_json()
        return Response(allAttendance, mimetype="application/json", status=200)

    def post(self):
        body = request.get_json()
        attendance = Attendance(**body).save()
        id = attendance.id
        return {'id': str(id)}, 200


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