from src.face_recognition import FaceApi


def initialize_routes(api):
    api.add_resource(FaceApi, "/api/face/<id>")
