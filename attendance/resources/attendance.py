import os

from flask import Response, request, current_app
from flask_restful import Resource
from flask_restful_swagger import swagger
from database.models import Attendance
from resources.azureface import compare_faces_azure
from resources.rekognition import compare_faces_rekognition
from resources.geofence import validateVicinity
from resources.user import fetchAdmin, fetchStudent
from resources.producer import publish_message
from resources.facenet import compare_faces_facenet
from resources.module import check_module_active
import datetime
import logging

log = logging.getLogger("root")


class AllAttendanceApi(Resource):
    @swagger.operation()
    def get(self):
        log.info("Inside get all attendance method ----->>")
        allAttendance = Attendance.objects().to_json()
        return Response(allAttendance, mimetype="application/json", status=200)

    @swagger.operation()
    def post(self):
        try:
            log.info("Inside create attendance method for student ----->>")
            azure_face_enabled = os.getenv("AZURE_FACE_ENABLED")
            aws_rekog_enabled = os.getenv("AWS_REKOG_ENABLED")

            if azure_face_enabled is None:
                log.info("AZURE_FACE_ENABLED not set, falling back to config")
                azure_face_enabled = current_app.config["AZURE_FACE_ENABLED"]
            if aws_rekog_enabled is None:
                log.info("AWS_REKOG_ENABLED not set, falling back to config")
                aws_rekog_enabled = current_app.config["AWS_REKOG_ENABLED"]

            body = request.get_json()
            attendance = Attendance(**body)
            self.check_if_attendance_marked(attendance)
            check_module_active(attendance.moduleId)
            validateVicinity(body)
            user = fetchStudent(attendance.username)
            if user.get("imageId") is None or len(user.get("imageId")) < 1:
                compare_faces_facenet(attendance.capturedImageId, attendance.username)
            else:
                if str(azure_face_enabled) == "1":
                    compare_faces_azure(
                        attendance.capturedImageId, user.get("imageId")[0]
                    )
                if str(aws_rekog_enabled) == "1":
                    compare_faces_rekognition(
                        attendance.capturedImageId, user.get("imageId")[0]
                    )
            attendance.save()
            publish_message(data=body, recorded=True)
        except Exception as ex:
            log.error("error from attendance method " + str(ex))
            return {"message": str(ex)}, 400
        return {"id": str(attendance.id)}, 200

    def check_if_attendance_marked(self, attendance):
        midnight_date = datetime.datetime.now().replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        try:
            Attendance.objects().get_or_404(
                username=attendance.username,
                moduleId=attendance.moduleId,
                date_captured=midnight_date,
            )
        except Exception as ex:
            log.info("no attendance marked for today")
        else:
            log.error("attendance has already been marked for today")
            raise Exception("Attendance already marked!")


class AttendanceApi(Resource):
    @swagger.operation()
    def put(self, id):
        log.info("Inside update attendance method for student by id ----->>")
        body = request.get_json()
        Attendance.objects.get(id=id).update(**body)
        return "", 200

    @swagger.operation()
    def delete(self, id):
        log.info("Inside delete attendance method for student by id ---->>")
        username = request.headers.get("Username")
        if username is None:
            raise Exception("Username header missing in delete request")
        else:
            user = fetchAdmin(username)
            Attendance.objects.get(id=id).delete()
            publish_message(data=username, recorded=False)
        return "", 200

    @swagger.operation()
    def get(self, id):
        log.info("Inside get attendance method for student by id ----->>")
        attendance = Attendance.objects.get(userId=id).to_json()
        return Response(attendance, mimetype="application/json", status=200)

    @swagger.operation()
    def get(self, username):
        log.info("Inside get attendance method for student by username ----->>")
        attendance = Attendance.objects.get(username=username).to_json()
        return Response(attendance, mimetype="application/json", status=200)
