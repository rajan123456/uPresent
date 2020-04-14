class Config(object):
    ELASTIC_APM = {
        'SERVICE_NAME': 'attendance-service',
        'SERVER_URL': 'http://apm-server:8200'
    }
    SAGA_ENABLED = 1
    # BASE_PACKAGE = '/Users/ashishgupta/git/uPresent/face-recognition/src/'
    BASE_PACKAGE = '/Users/anchitseth/Documents/sts-workspace/uPresent/face-recognition/src/'
    DATASET_PATH = '/Users/anchitseth/Documents/sts-workspace/uPresent/face-recognition/dataset'
    