import os

from flask import Response, request, current_app
from flask_restful import Resource
from flask_restful_swagger import swagger
from database.models import Attendance
from resources.azureface import compare_faces_azure
from resources.rekognition import compare_faces_rekognition
from resources.geofence import validateVicinity
from resources.user import User
from resources.producer import publish_message
from resources.facenet import compare_faces_facenet
from resources.module import check_module_active
from resources.school import check_school_active
import datetime
import json
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
        u = User()
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
            school = check_school_active(attendance.school)
            check_module_active(attendance.moduleId, school.get("timeZone"))
            validateVicinity(body)
            user = u.fetchStudent(username=attendance.username)
            if user.get("imageId") is None or len(user.get("imageId")) < 1:
                attendance.recognitionSource = "facenet"
                attendance.recognitionConfidence = compare_faces_facenet(
                    attendance.capturedImageId, attendance.username
                )
            else:
                if str(azure_face_enabled) == "1":
                    attendance.recognitionSource = "azure"
                    attendance.recognitionConfidence = compare_faces_azure(
                        attendance.capturedImageId, user.get("imageId")[0]
                    )
                if str(aws_rekog_enabled) == "1":
                    attendance.recognitionSource = "aws"
                    attendance.recognitionConfidence = compare_faces_rekognition(
                        attendance.capturedImageId, user.get("imageId")[0]
                    )
            attendance.save()
            publish_message(data=json.loads(attendance.to_json()), recorded=True)
        except Exception as ex:
            log.error("error from post attendance method " + str(ex))
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
            raise Exception("Attendance either marked already or has been revoked")


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
        try:
            u = User()
            username = request.headers.get("Username")
            if username is None:
                raise Exception("Username header missing in delete request")
            else:
                user = u.fetchAdmin(username=username)
                attendance = Attendance.objects.get(id=id)
                attendance.status = "REVOKED"
                attendance.save()
                publish_message(
                    data={
                        "username": attendance.username,
                        "revokedBy": username,
                        "moduleId": attendance.moduleId,
                    },
                    recorded=False,
                )
        except Exception as ex:
            log.error("error from delete attendance method " + str(ex))
            return {"message": str(ex)}, 400
        return "", 200

    @swagger.operation()
    def get(self, id):
        log.info("Inside get attendance method by id ----->>")
        attendance = Attendance.objects.get(id=id).to_json()
        return Response(attendance, mimetype="application/json", status=200)

    @swagger.operation()
    def get(self, username):
        log.info("Inside get attendance method for student by username ----->>")
        attendance = Attendance.objects.get(username=username).to_json()
        return Response(attendance, mimetype="application/json", status=200)
