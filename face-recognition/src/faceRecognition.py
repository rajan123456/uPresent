from flask import Response
from flask_restful import Resource
from flask_restful_swagger import swagger
from src.embeddings import extract
from src.train_model import training
from src.recognize import recog


class FaceApi(Resource):

    @swagger.operation()
    def get(self):
        extract()
        training()
        data = recog('/Users/anchitseth/Documents/sts-workspace/uPresent/face-recognition/test_images/anchit.jpg')
        # data = recog('/Users/ashishgupta/git/uPresent/face-recognition/src/images/adrian.jpg')
        return Response(data, mimetype="application/json", status=200)