FROM python:3.8.5
COPY . /app
WORKDIR /app
RUN pip install pipenv
RUN pipenv install --deploy --ignore-pipfile
ENTRYPOINT ["python"]
CMD ["app.py"]