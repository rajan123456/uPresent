FROM python:2.7
COPY . /app
WORKDIR /app
RUN pip install pipenv
RUN pipenv install --deploy --ignore-pipfile
ENTRYPOINT ["python"]
CMD ["app.py"]