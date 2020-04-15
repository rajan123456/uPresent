import os
import json
import base64

from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kafka import KafkaUtils
from pyspark.sql import SparkSession

# Constants
BATCH_DURATION = 3
TOPIC = "videoCollector"
BROKER_INFO = "broker:29092"
IMAGE_FOLDER_PATH = "/training-data/images/"
#IMAGE_FOLDER_PATH = "D:/PythonWorkspace/"

# Set environment variables
#os.environ['PYTHONPATH'] = "D:/ApacheSpark/spark-2.4.5-bin-hadoop2.7/python"
#os.environ['SPARK_HOME'] = "D:/ApacheSpark/spark-2.4.5-bin-hadoop2.7"


def init_spark():
    sc = SparkContext(appName="videoStreamCollector")
    ssc = StreamingContext(sc, BATCH_DURATION)
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
            image_folder = IMAGE_FOLDER_PATH + imageInfo.username

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
    topic = TOPIC
    brokers = BROKER_INFO

    # Creating spark DStreams
    stream = KafkaUtils.createDirectStream(
        ssc, [topic], {"metadata.broker.list": brokers})
    lines = stream.map(lambda x: json.loads(x[1]))
    lines.pprint()
    lines.foreachRDD(lambda rdd: process(rdd, sc))

    # To start the spark streaming
    ssc.start()
    ssc.awaitTermination()


if __name__ == '__main__':
    main()
