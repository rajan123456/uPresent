# Stream Processor #

The Stream Processor is another part of video processor pipeline. It is developed using Spark Streaming, which is an incredibly powerful realtime data processing framework based on Apache Spark and enables scalable, high-throughput, fault-tolerant stream processing of live data streams. It allows us to process realtime streams from Apache Kafka using Python with incredible simplicity. It is processing live data streams of large image frames, received from videoProcessor service and prepare training data for further processing by student's facial recognition system. The training data prepared, is then stored in a filesystem. 

Stream Processing is a `PySpark` job which is ingesting data from Apache Kafka. As part of Spark processing environment setup, we have created a Master node and two worker nodes. 

Now to setup a runtime environment we must set the `SPARK_HOME`, `PYTHONPATH` and also place `spark-streaming-kafka` jar in the working directory. We also need to import the necessary pySpark modules for Spark, Spark Streaming, and Spark Streaming with Kafka inside our pytho code.

**Architecture**

Let us look at the Stream Processor architecture diagram below :

![Stream Processor](https://github.com/rajan123456/uPresent/blob/documentation/dipty/streamProcessor/StreamProcessor.jpg)

As seen in the architecture diagram, stream of image frame data is ingested to Spark from Kafka 'videoCollector' topic. Spark Streaming receives live input data streams and divides the data into micro-batches, which are called discretized stream or DStream. And internally, a DStream is represented as a sequence of RDDs.

The inbound DStream, is transformed to parse the inbound messages from their native JSON format. To perform further action on these Dstreams we convert it into DataFrames. These dataframes are useful for doing structured query on the data streams.

After the transformation process, we  clean the data by eliminating all the images which contains no faces or more than one face. This is done by retrieving the image base64 encoded string from dataframes and decodin them back into a 'png' format image data. Which is then processed using pre-trained `Haar Cascade model` from `OpenCV` and `Python` to detect and extract faces from an image.

After the cleaning step, filtered image data is labeled. To do this we are segregating image files based on their respective usernames.

After processing the image data, it is then stored into a filesystem. These processsed images are stored under different directories based on the username in the filesystem.

These image data constitutes the training data for our Face recognition system.


