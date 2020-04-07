class Config(object):
    ELASTIC_APM = {
        "SERVICE_NAME": "video-processor",
        "SERVER_URL": "http://apm-server:8200",
    }
    VIDEO_INPUT_PATH = 'rtmp://3.15.151.129/app/'
    FRAMES_PATH = './data'
    KAFKA_SERVER_IP = 'broker:29092'
    KAFKA_TOPIC = 'videoCollector'
    KAFKA_BATCH_SIZE = 176580  # this value should be as per the size of image frames
    KAFKA_LINGER_MS = 10
