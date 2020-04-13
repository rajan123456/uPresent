FROM python:3.7
COPY . /videoStreamCollector
WORKDIR /videoStreamCollector
RUN pip install -r requirements.txt

## configure java jdk 8
ENV JAVA_HOME="/usr/local/oracle-java-8/jdk1.8.0_191"

## configure spark
ENV SPARK_HOME="/usr/local/spark-2.4.5/spark-2.4.5-bin-hadoop2.7"

## expose for spark
EXPOSE 4040

WORKDIR $SPARK_HOME

CMD ["bin/spark-submit", "org.apache.spark", "videoStreamCollector.py"]