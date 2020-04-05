class Config(object):
    ELASTIC_APM = {
        "SERVICE_NAME": "video-processor",
        "SERVER_URL": "http://apm-server:8200",
    }
    VIDEO_INPUT_PATH = 'D:/PythonWorkspace/inputData/example.mp4'
    FRAMES_PATH = 'D:/PythonWorkspace/data'
    KAFKA_SERVER_IP = 'localhost:9092'
    KAFKA_TOPIC = 'videoCollector'
