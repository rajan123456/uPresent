from kafka import KafkaProducer
from urllib.request import *
from flask import current_app
import json
from datetime import datetime
import logging
import os

log = logging.getLogger("root")


def connect_kafka_producer():
    _producer = None
    try:
        _producer = KafkaProducer(
            bootstrap_servers=current_app.config["KAFKA_ADDRESS"], api_version=(0, 10)
        )
    except Exception as ex:
        log.error("Exception while connecting Kafka")
        log.error(str(ex))
    finally:
        return _producer


def publish_message(data, recorded):
    saga_enabled = os.getenv("SAGA_ENABLED")
    if saga_enabled is None:
        saga_enabled = current_app.config["SAGA_ENABLED"]
    if str(saga_enabled) == "1":
        publish_message_kafka(data, recorded)
    else:
        publish_message_api_call(data, recorded)


def publish_message_kafka(data, recorded):
    if recorded is True:
        eventType = str(current_app.config["ATTENDANCE_RECORDED"])
    else:
        eventType = str(current_app.config["ATTENDANCE_REVOKED"])
    try:
        producer_instance = connect_kafka_producer()
        body = (
            json.dumps(data)
            + ";"
            + eventType
            + ";"
            + datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
            + "; ;"
            + str(current_app.config["ATTENDANCE_SOURCE_ID"])
        )
        key_bytes = bytes("message", encoding="utf-8")
        value_bytes = bytes(body, encoding="utf-8")
        producer_instance.send(
            current_app.config["KAFKA_PUBLISH_TOPIC"], key=key_bytes, value=value_bytes
        )
        producer_instance.flush()
        log.info("Message published successfully via kafka")
    except Exception as ex:
        log.error("Exception in publishing message via kafka")
        log.error(str(ex))


def publish_message_api_call(data, recorded):
    if recorded is True:
        eventType = str(current_app.config["ATTENDANCE_RECORDED"])
    else:
        eventType = str(current_app.config["ATTENDANCE_REVOKED"])
    try:
        encoded_body = {
            "eventData": json.dumps(data),
            "eventType": eventType,
            "sourceId": str(current_app.config["ATTENDANCE_SOURCE_ID"]),
            "timeStamp": datetime.now().strftime("%m/%d/%Y, %H:%M:%S"),
        }
        report_api = os.getenv("REPORT_PUBLISH_API")
        if report_api is None:
            report_api = current_app.config["REPORT_PUBLISH_API"]
        req = Request(
            url=report_api,
            data=json.dumps(encoded_body).encode(),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urlopen(req) as res:
            body = res.read().decode()
        log.info("Message published successfully via api")
    except Exception as ex:
        log.error("Exception in publishing message via api")
        log.error(str(ex))
