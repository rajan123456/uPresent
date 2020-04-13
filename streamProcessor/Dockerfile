FROM python:3.7
COPY . /videoStreamCollector
WORKDIR /videoStreamCollector
RUN pip install -r requirements.txt

## configure java jdk 8
ENV JAVA_HOME="/usr/local/oracle-java-8/jdk1.8.0_191"

CMD ["bin/spark-submit", "videoStreamCollector.py"]