from flask import Response
from flask_restful import Resource
from flask_restful_swagger import swagger
from resources.embeddings import extract
from resources.train_model import training
from resources.recognize import recog


class FaceApi(Resource):

    @swagger.operation()
    def get(self):
        extract()
        training()
        data = recog('/Users/ashishgupta/git/uPresent/face-recognition/resources/images/adrian.jpg')
        return Response(data, mimetype="application/json", status=200)