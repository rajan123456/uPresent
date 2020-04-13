import os
import json
import config
import base64

from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kafka import KafkaUtils
from pyspark.sql import SparkSession

# Set environment variables
os.environ['PYTHONPATH'] = config.Config.PYTHONPATH
os.environ['SPARK_HOME'] = config.Config.SPARK_HOME


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
                fh.write(base64.b64decode(imageInfo.imageData))
                image_no += 1
    except Exception as ex:
        print('Exception while processing images inside process method--->>')
        print(str(ex))
        pass


def main():
    sc, ssc = init_spark()
    topic = config.Config.TOPIC
    brokers = config.Config.BROKER_INFO

    # Creating spark DStreams
    stream = KafkaUtils.createDirectStream(ssc, [topic], {"metadata.broker.list": brokers})
    lines = stream.map(lambda x: json.loads(x[1]))
    lines.pprint()
    lines.foreachRDD(lambda rdd: process(rdd, sc))

    # To start the spark streaming
    ssc.start()
    ssc.awaitTermination()


if __name__ == '__main__':
    main()
