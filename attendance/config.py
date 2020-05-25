class Config(object):
    MONGODB_SETTINGS = {
        # "host": "mongodb://root:example@localhost:27017/admin"
        "host": "mongodb://root:example@mongo-attendance:27017/admin"
    }
    # UPLOAD_DIR = (
    #    "C:\\Users\\rajan\\PiggybackIncentives\\uPresent\\scripts\\dev\\user-data-vol\\"
    # )
    UPLOAD_DIR = "/app/resources/images/"
    THRESHOLD_CONFIDENCE = 50
    ELASTIC_APM = {
        "SERVICE_NAME": "attendance-service",
        # "SERVER_URL": "http://localhost:8200",
        "SERVER_URL": "http://apm-server:8200",
    }
    # VAULT_CLIENT_CERT = (
    #    "C:\\Users\\rajan\\PiggybackIncentives\\uPresent\\attendance\\attendance.pem"
    # )
    VAULT_CLIENT_CERT = "/app/attendance.pem"
    # VAULT_CLIENT_KEY = (
    #    "C:\\Users\\rajan\\PiggybackIncentives\\uPresent\\attendance\\key.pem"
    # )
    VAULT_CLIENT_KEY = "/app/key.pem"
    # VAULT_HOSTNAME = "localhost"
    VAULT_HOSTNAME = "vault"
    # VAULT_PORT = 8300
    VAULT_PORT = 8200
    VAULT_LOGIN_URL = "/v1/auth/cert/login"
    VAULT_DATA_URL = "/v1/aws/data"
    # KAFKA_ADDRESS = "localhost:9092"
    KAFKA_ADDRESS = "broker:29092"
    KAFKA_PUBLISH_TOPIC = "attendanceEvents"
    SAGA_ENABLED = 1
    ATTENDANCE_RECORDED = "attendanceRecorded"
    ATTENDANCE_REVOKED = "attendanceRevoked"
    ATTENDANCE_SOURCE_ID = 3
    # REPORT_PUBLISH_API = "http://localhost:8083/reporting"
    REPORT_PUBLISH_API = "http://reporting:8080/reporting"
    # FACENET_RECOGNITION_API = "http://localhost:7000/api/face/"
    FACENET_RECOGNITION_API = "http://facenet:5000/api/face/"
    # MODULE_API_FETCH_DETAILS = "http://localhost:8082/manage/module?moduleCode="
    MODULE_API_FETCH_DETAILS = "http://management:8080/manage/module?moduleCode="
    # MANAGEMENT_API_GEO_FENCE = (
    #     "http://localhost:8081/manage/school/geo-fence?schoolCode="
    # )
    MANAGEMENT_API_GEO_FENCE = (
        "http://management:8080/manage/school/geo-fence?schoolCode="
    )
    # MANAGEMENT_API_SCHOOL = "http://localhost:8082/manage/school?schoolCode="
    MANAGEMENT_API_SCHOOL = "http://management:8080/manage/school?schoolCode="
    # USER_API_FETCH_USER = "http://localhost:8084/user?username="
    USER_API_FETCH_USER = "http://user:8080/user?username="
    AZURE_FACE_ENDPOINT = "https://eastus.api.cognitive.microsoft.com/"
    AZURE_FACE_ENABLED = 0
    AWS_REKOG_ENABLED = 1
