FROM python:3.7.8-stretch

RUN apt-get update \
    && apt-get install -y \
    openjdk-8-jdk \
    && apt-get clean

RUN cd /usr/ \
    && wget "http://archive.apache.org/dist/spark/spark-2.4.5/spark-2.4.5-bin-hadoop2.7.tgz" \
    && tar xzf spark-2.4.5-bin-hadoop2.7.tgz \
    && rm spark-2.4.5-bin-hadoop2.7.tgz \
    && mv spark-2.4.5-bin-hadoop2.7 spark

ENV SPARK_HOME=/usr/spark
ENV PYTHONPATH=$SPARK_HOME/python/lib/py4j-0.10.7-src.zip:$SPARK_HOME/python/:$PYTHONPATH
ENV MASTER=spark://spark:7077

RUN mkdir -p /usr/spark/work/ \
    && chmod -R 777 /usr/spark/work/

WORKDIR /app
COPY . /app

RUN pip install -r requirements.txt

CMD ["/usr/spark/bin/spark-submit", "--jars", "spark-streaming-kafka-0-8-assembly.jar", "videoStreamCollector.py"]