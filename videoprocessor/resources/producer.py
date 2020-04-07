from kafka import KafkaProducer
import datetime
import json
import config


def publish_message(producer_instance, topic_name, key, username, value):
    try:
        key_bytes = bytes(key, encoding='utf-8')
        value_bytes = str(value, encoding='utf-8')

        # Creating a JSON object to send to topic
        data_set = {"imageData": value_bytes, "username": username,
                    "timestamp": datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")}

        producer_instance.send(topic_name, key=key_bytes, value=data_set)
        producer_instance.flush()
        print('Message published successfully.')
    except Exception as ex:
        print('Exception in publishing message')
        print(str(ex))


def connect_kafka_producer():
    _producer = None
    try:
        _producer = KafkaProducer(value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                                  bootstrap_servers=config.Config.KAFKA_SERVER_IP,
                                  linger_ms=config.Config.KAFKA_LINGER_MS,
                                  batch_size=config.Config.KAFKA_BATCH_SIZE)
    except Exception as ex:
        print('Exception while connecting Kafka')
        print(str(ex))
    finally:
        return _producer
