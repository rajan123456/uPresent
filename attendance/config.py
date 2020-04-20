class Config(object):
    MONGODB_SETTINGS = {
        #'host': "mongodb://localhost:27017/admin"
        'host': "mongodb://root:example@mongo:27017/admin"
    }
    UPLOAD_DIR = "/app/resources/images/"
    THRESHOLD_CONFIDENCE = 60
    ELASTIC_APM = {
        'SERVICE_NAME': 'attendance-service',
        'SERVER_URL': 'http://apm-server:8200'
    }
    VAULT_CLIENT_CERT = "/app/attendance.pem"
    VAULT_CLIENT_KEY = "/app/key.pem"
    VAULT_HOSTNAME = "vault"
    VAULT_PORT = 8200
    VAULT_LOGIN_URL = "/v1/auth/cert/login"
    VAULT_DATA_URL = "/v1/aws/data"
    KAFKA_ADDRESS = "broker:29092"
    KAFKA_PUBLISH_TOPIC = "attendanceEvents"
    SAGA_ENABLED = 1
    ATTENDANCE_RECORDED = 'attendanceRecorded'
    ATTENDANCE_SOURCE_ID = 3
    REPORT_PUBLISH_API = 'http://reporting:8080/reporting'
    FACENET_RECOGNITION_API = 'http://facenet:5000/api/face/'
    MODULE_API_FETCH_DETAILS = 'http://management:8080/manage/module?moduleCode='
    MANAGEMENT_API_GEO_FENCE = "http://management:8080/manage/geo-fence?universityName="
    USER_API_FETCH_USER = "http://user:8080/user?username="
    # MANAGEMENT_API_GEO_FENCE = "http://localhost:8081/manage/geo-fence?universityName="
    # USER_API_FETCH_USER = "http://localhost:8083/user?username="
    #MODULE_API_FETCH_DETAILS = 'https://dev.upresent.ga/management/manage/module?moduleCode='