from flask import Response, request
from flask_restful_swagger import swagger
from resources.videoSplitter import videosplitter
from flask_restful import Resource
from threading import Thread


class VideoProcessorApi(Resource):

    @swagger.operation()
    def post(self):
        body = request.get_json()
        thread = Thread(target=videosplitter, kwargs={'key': request.args.get('key', body['stream'])})
        thread.start()
        return Response("0", status=200)