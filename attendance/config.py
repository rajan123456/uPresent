class Config(object):
    MONGODB_SETTINGS = {
        # 'host': "mongodb://localhost:27017/admin"
        'host': "mongodb://root:example@mongo:27017/admin"
    }
    MANAGEMENT_API_GEO_FENCE = "http://management/manage/geo-fence?universityName="
    USER_API_FETCH_USER = "http://user/user?username="
    UPLOAD_DIR = "/app/resources/images/"
    THRESHOLD_CONFIDENCE = 60
    ELASTIC_APM = {
      'SERVICE_NAME': 'attendance-service',
      'SERVER_URL': 'http://apm-server:8200'
    }