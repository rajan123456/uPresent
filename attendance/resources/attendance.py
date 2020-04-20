from flask import Response, request
from flask_restful import Resource
from flask_restful_swagger import swagger
from database.models import Attendance
from resources.rekognition import compare_faces_rekognition
from resources.geofence import validateVicinity
from resources.user import fetchUser
from resources.producer import publish_message
from resources.facenet import compare_faces_facenet
from resources.module import check_module_active
import datetime
import logging

# set logging level for 'video Processor'
log = logging.getLogger('root')

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
            body = request.get_json()
            attendance = Attendance(**body)
            self.check_if_attendance_marked(attendance)
            check_module_active(attendance.moduleId)
            validateVicinity(body)
            user = fetchUser(attendance.username)
            if user.get('imageId') is None:
                compare_faces_facenet(attendance.capturedImageId, attendance.username)
            else:
                compare_faces_rekognition(attendance.capturedImageId, user.get('imageId')[0])
            attendance.save()
            publish_message(body)
        except Exception as ex:
            return {'message': str(ex)}, 400
        return {'id': str(attendance.id)}, 200

    def check_if_attendance_marked(self, attendance):
        midnight_date = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        try:
            Attendance.objects().get_or_404(username=attendance.username,
                                        moduleId=attendance.moduleId,
                                        date_captured=midnight_date)
        except Exception as ex:
            log.info('no attendance marked for today')
        else:
            log.error('attendance has already been marked for today')
            raise Exception('Attendance already marked!')

class AttendanceApi(Resource):

    @swagger.operation()
    def put(self, id):
        log.info("Inside update attendance method for student by id ----->>")
        body = request.get_json()
        Attendance.objects.get(id=id).update(**body)
        return '', 200

    @swagger.operation()
    def delete(self, id):
        log.info("Inside delete attendance method for student by id ---->>")
        movie = Attendance.objects.get(id=id).delete()
        return '', 200

    @swagger.operation()
    def get(self, id):
        log.info("Inside get attendance method for student by id ----->>")
        attendance = Attendance.objects.get(userId=id).to_json()
        return Response(attendance, mimetype="application/json", status=200)
