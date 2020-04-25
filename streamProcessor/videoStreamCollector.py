import os
import base64
import logging
import config
from pyspark.sql.functions import from_json, col
from pyspark.sql.types import *
from pyspark.sql import SparkSession
from resources import face_scrapper


def init_spark():
    spark = SparkSession \
        .builder \
        .appName("videoStreamCollector") \
        .master("master") \
        .config("spark.jars", config.Config.SPARK_JARS_PATH) \
        .config("spark.executor.extraClassPath", config.Config.SPARK_EXECUTOR_JARS) \
        .config("spark.executor.extraLibrary", config.Config.SPARK_EXECUTOR_JARS) \
        .config("spark.driver.extraClassPath", config.Config.SPARK_EXECUTOR_JARS) \
        .getOrCreate()
    spark.sparkContext.setLogLevel("WARN")
    return spark


def main():
    spark = init_spark()
    topic = config.Config.TOPIC
    brokers = config.Config.BROKER_INFO

    df = spark.readStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", brokers) \
        .option("subscribe", topic) \
        .option("startingOffsets", "latest") \
        .load()
    df1 = df.selectExpr("CAST(value AS STRING)", "timestamp")

    transaction_detail_schema = StructType() \
        .add("imageData", StringType()) \
        .add("username", StringType()) \
        .add("timestamp", StringType())

    df2 = df1 \
        .select(from_json(col("value"), transaction_detail_schema).alias("transaction_detail"), "timestamp")
    df3 = df2.select("transaction_detail.*", "timestamp")
    df3.printSchema()
    df3.writeStream.trigger(processingTime=config.Config.TRIGGER_INTERVAL).outputMode("append") \
        .format("console") \
        .start()

    if not df3.count == 0:
        df4 = df3.select("imageData", "username")
        trans_detail_write_stream = df4 \
            .writeStream \
            .trigger(processingTime=config.Config.TRIGGER_INTERVAL) \
            .format("memory") \
            .queryName("images") \
            .outputMode("append") \
            .start()

        imageDataFrame = spark.sql("select * from images")
        imageDataFrame.show()
        for imageInfo in imageDataFrame.collect():
            image_folder = config.Config.IMAGE_FOLDER_PATH + imageInfo.username

            # Creating image folder based on userNames
            if not os.path.exists(image_folder):
                os.makedirs(image_folder)
                image_no = 1
            else:
                image_no = len(os.listdir(image_folder)) + 1

            if len(os.listdir(image_folder)) < 60:
                # Converting Base64 to image
                with open(image_folder + "/imageToSave" + str(image_no) + ".png", "wb") as fh:
                    image = base64.b64decode(imageInfo.imageData)

                    # Calling face scrapper class to detect faces in the image
                    face_len = face_scrapper.face_detection(image)
                    if face_len == 1:
                        fh.write(image)
                        image_no += 1
    else:
        logging.warning("Video Stream has no  data to process")
    # To start the spark streaming
    trans_detail_write_stream.awaitTermination()


if __name__ == '__main__':
    main()
