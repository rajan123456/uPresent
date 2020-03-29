FROM python:3.7
COPY . /app
WORKDIR /app
ENV FLASK_ENV=development
RUN pip install -r requirements.txt
ENTRYPOINT ["python"]
CMD ["app.py"]