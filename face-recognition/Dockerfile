FROM python:2.7
COPY . /app
COPY resources/* /app/resources/
WORKDIR /app
RUN pip install -r requirements.txt
ENTRYPOINT ["python"]
CMD ["app.py"]