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
                for imageInfo in imageDataFrame.collect():
                    image_folder = config.Config.IMAGE_FOLDER_PATH + imageInfo.username

                    # Creating image folder based on userNames
                    if not os.path.exists(image_folder):
                        os.makedirs(image_folder)
                        image_no = 1
                    else:
                        image_no = len(os.listdir(image_folder)) + 1

                    if len(os.listdir(image_folder)) < config.Config.IMAGE_COUNT:
                        # Converting Base64 to image
                        image = base64.b64decode(imageInfo.imageData)

                        # Calling face scrapper class to detect faces in the image
                        face_len = face_scrapper.face_detection(image)

                        if face_len == 1:
                            with open(
                                image_folder + "/imageToSave" + str(image_no) + ".png",
                                "wb",
                            ) as fh:
                                fh.write(image)
                                image_no += 1
        else:
            logging.warning("StreamProcessor did not receive any new data to process.")
    except Exception as ex:
        logging.warning("Exception while processing images inside process method--->>")
        logging.warning(str(ex))
        pass


def main():
    sc, ssc = init_spark()
    topic = config.Config.TOPIC

    brokers = os.getenv("BROKER_INFO")
    if brokers is None:
        brokers = config.Config.BROKER_INFO

    # Creating spark DStreams
    stream = KafkaUtils.createDirectStream(
        ssc, [topic], {"metadata.broker.list": brokers}
    )
    lines = stream.map(lambda x: json.loads(x[1]))
    lines.pprint()
    lines.foreachRDD(lambda rdd: process(rdd, sc))
    logging.warning("Spark DStream created from Kafka stream input")
    # To start the spark streaming
    ssc.start()
    ssc.awaitTermination()


if __name__ == "__main__":
    main()
