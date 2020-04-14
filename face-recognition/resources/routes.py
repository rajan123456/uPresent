from resources.faceRecognition import FaceApi

def initialize_routes(api):
    api.add_resource(FaceApi, '/api/face')