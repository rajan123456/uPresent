FROM python:3.8.0b1-stretch

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