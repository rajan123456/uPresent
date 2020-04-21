from flask import Response, request
from flask_restful_swagger import swagger
from resources.videoSplitter import videosplitter
from flask_restful import Resource
from threading import Thread


class VideoProcessorApi(Resource):

    @swagger.operation()
    def post(self):
        body = request.get_json()
        Thread(target=videosplitter(body['stream'])).start()
        return Response({'Video pushed to Kafka successfully...'}, status=200)