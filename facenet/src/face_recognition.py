from flask import Response
from flask_restful import Resource
from flask_restful_swagger import swagger
import constants
from src.recognize import recog
import json


class FaceApi(Resource):
    @swagger.operation()
    def get(self, id):
        username, confidence = recog(constants.UPLOAD_DIR + id)
        response = {"username": username, "confidence": confidence}
        return Response(json.dumps(response), mimetype="application/json", status=200)
