from flask import Response
from flask_restful import Resource
from flask_restful_swagger import swagger
import constants
from src.recognize import recog


class FaceApi(Resource):

    @swagger.operation()
    def get(self):
        data = recog(constants.SAMPLE_TEST_IMAGE_PATH)
        # data = recog('/Users/ashishgupta/git/uPresent/face-recognition/src/images/adrian.jpg')
        return Response(data, mimetype="application/json", status=200)