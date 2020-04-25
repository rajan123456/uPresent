class Config(object):
    BATCH_DURATION = 10
    TOPIC = "videoCollector"
    BROKER_INFO = "broker:29092"
    IMAGE_FOLDER_PATH = "/training-data/images/"
    RGB_SCALE_FACTOR = 1.3
    MIN_NEIGHBORS = 3
    MIN_HEIGHT = 3
    MIN_WIDTH = 3
    IMAGE_COUNT = 60
    SPARK_JARS_PATH = "file:///streamProcessor//spark-sql-kafka-0-10_2.11-2.4.5.jar," \
                      "file:///streamProcessor//kafka-clients-2.4.0.jar "

    SPARK_EXECUTOR_JARS = "file:///streamProcessor//spark-sql-kafka-0-10_2.11-2.4.5.jar" \
                          ":file:///streamProcessor//kafka-clients-2.4.0.jar"
