FROM rajagupt/spark-base:2.4.5-py3.6-java8

RUN mkdir -p /usr/spark/work/ && chmod -R 777 /usr/spark/work/

WORKDIR /app
COPY . /app

# https://github.com/pypa/pipenv/issues/4273
# RUN pip install pipenv
RUN pip install 'pipenv==2018.11.26'
RUN pipenv install --deploy --system

CMD ["/usr/spark/bin/spark-submit", "--jars", "spark-streaming-kafka-0-8-assembly.jar", "videoStreamCollector.py"]