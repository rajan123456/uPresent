from kafka import KafkaProducer
from urllib.request import *
from flask import current_app
import json
from datetime import datetime


def connect_kafka_producer():
    _producer = None
    try:
        _producer = KafkaProducer(bootstrap_servers=current_app.config['KAFKA_ADDRESS'], api_version=(0, 10))
    except Exception as ex:
        print('Exception while connecting Kafka')
        print(str(ex))
    finally:
        return _producer


def publish_message(data):
    if current_app.config['SAGA_ENABLED'] == 1:
        publish_message_kafka(data)
    else:
        publish_message_api_call(data)


def publish_message_kafka(data):
    try:
        producer_instance = connect_kafka_producer()
        body = json.dumps(data) + ';' + str(current_app.config['ATTENDANCE_RECORDED']) + ';' + \
               datetime.now().strftime("%m/%d/%Y, %H:%M:%S") + ';' + \
               str(current_app.config['ATTENDANCE_SOURCE_ID'])
        key_bytes = bytes('message', encoding='utf-8')
        value_bytes = bytes(body, encoding='utf-8')
        producer_instance.send(current_app.config['KAFKA_PUBLISH_TOPIC'], key=key_bytes, value=value_bytes)
        producer_instance.flush()
        print('Message published successfully.')
    except Exception as ex:
        print('Exception in publishing message via kafka')
        print(str(ex))


def publish_message_api_call(data):
    try:
        encoded_body = {
            "eventData": json.dumps(data),
            "eventType": str(current_app.config['ATTENDANCE_RECORDED']),
            "sourceId": str(current_app.config['ATTENDANCE_SOURCE_ID']),
            "timeStamp": datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        }
        req = Request(url=current_app.config['REPORT_PUBLISH_API'], data=json.dumps(encoded_body).encode(),
                      headers={'Content-Type': 'application/json'},
                      method='POST')
        with urlopen(req) as res:
            body = res.read().decode()
        print(body)
    except Exception as ex:
        print('Exception in publishing message via api')
        print(str(ex))
