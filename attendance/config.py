class Config(object):
    MONGODB_SETTINGS = {
        # 'host': "mongodb://localhost:27017/admin"
        'host': "mongodb://root:example@mongo:27017/admin"
    }
    MANAGEMENT_API_GEO_FENCE = "http://management/manage/geo-fence?universityName="