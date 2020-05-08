from .videoProcessor import VideoProcessorApi


def initialize_routes(api):
    api.add_resource(VideoProcessorApi, "/api/videoprocessor")
