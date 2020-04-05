from flask import Response
from flask_restful_swagger import swagger
from resources.videoSplitter import videosplitter
from flask_restful import Resource


class VideoProcessorApi(Resource):

    @swagger.operation()
    def get(self):
        try:
            videosplitter()
        except Exception as ex:
            return {'message': str(ex)}, 500
        return Response({'Video pushed to Kafka successfully...'}, status=200)

