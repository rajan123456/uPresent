FROM python:2.7

COPY . /app
WORKDIR /app

# https://github.com/pypa/pipenv/issues/4273
# RUN pip install pipenv
RUN pip install 'pipenv==2018.11.26'
RUN pipenv install --deploy --system

ENTRYPOINT ["python"]
CMD ["app.py"]