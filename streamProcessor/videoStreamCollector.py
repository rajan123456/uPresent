import os
import json
import base64
import logging
import config

from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kafka import KafkaUtils
from pyspark.sql import SparkSession
from resources import face_scrapper


# create logger with 'videoStreamCollector'
logger = logging.getLogger('videoStreamCollector')
logger.setLevel(logging.DEBUG)


def init_spark():
    sc = SparkContext(appName="videoStreamCollector")
    ssc = StreamingContext(sc, config.Config.BATCH_DURATION)
    sc.setLogLevel("WARN")
    return sc, ssc


def process(rdd, sc):
    try:
        spark = SparkSession(sc)
        if not rdd.isEmpty():
            # Converting DStream into DataFrames
            df = spark.read.json(rdd)
            df.show()
            df.createOrReplaceTempView("images")
            if not df.count == 0:
                imageDataFrame = spark.sql("select imageData, username from images")
                imageDataFrame.show()

                # Getting imageBase64 from SQL and storing them into filesystem
                image_no = 1
                for imageInfo in imageDataFrame.collect():
                    image_folder = config.Config.IMAGE_FOLDER_PATH + imageInfo.username

                    # Creating image folder based on userNames
                    if not os.path.exists(image_folder):
                        os.makedirs(image_folder)

                    # Converting Base64 to image
                    with open(image_folder + "/imageToSave" + str(image_no) + ".png", "wb") as fh:
                        image = base64.b64decode(imageInfo.imageData)

                        # Calling face scrapper class to detect faces in the image
                        face_len = face_scrapper.face_detection(image)
                        if face_len == 1:
                            fh.write(image)

                        image_no += 1
        else:
            logger.info("Video Stream has no  data to process")
    except Exception as ex:
        logger.debug('Exception while processing images inside process method--->>')
        logger.exception(str(ex))
        pass


def main():
    sc, ssc = init_spark()
    topic = config.Config.TOPIC
    brokers = config.Config.BROKER_INFO

    # Creating spark DStreams
    stream = KafkaUtils.createDirectStream(
        ssc, [topic], {"metadata.broker.list": brokers})
    lines = stream.map(lambda x: json.loads(x[1]))
    lines.pprint()
    lines.foreachRDD(lambda rdd: process(rdd, sc))
    logger.info("Spark DStream created from Kafka stream input")
    # To start the spark streaming
    ssc.start()
    ssc.awaitTermination()


if __name__ == '__main__':
    main()
