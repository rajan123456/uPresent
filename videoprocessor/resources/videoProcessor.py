from flask import Response, request
from flask_restful_swagger import swagger
from resources.videoSplitter import videosplitter
from flask_restful import Resource


class VideoProcessorApi(Resource):

    @swagger.operation()
    def post(self):
        body = request.get_json()
        try:
            videosplitter(body['key'])
        except Exception as ex:
            return {'message': str(ex)}, 500
        return Response({'Video pushed to Kafka successfully...'}, status=200)

