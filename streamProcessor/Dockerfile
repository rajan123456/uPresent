FROM rajagupt/spark-base:2.4.5-py3.6-java8

ENV MASTER=spark://spark:7077

RUN mkdir -p /usr/spark/work/ && chmod -R 777 /usr/spark/work/

WORKDIR /app
COPY . /app

RUN pip install pipenv
RUN pipenv install --deploy --ignore-pipfile

CMD ["/usr/spark/bin/spark-submit", "--jars", "spark-streaming-kafka-0-8-assembly.jar", "videoStreamCollector.py"]