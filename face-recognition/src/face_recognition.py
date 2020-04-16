from flask import Response
from flask_restful import Resource
from flask_restful_swagger import swagger
import constants
from src.recognize import recog


class FaceApi(Resource):

    @swagger.operation()
    def get(self, id):
        data = recog(constants.UPLOAD_DIR + id)
        return Response(data, mimetype="application/json", status=200)