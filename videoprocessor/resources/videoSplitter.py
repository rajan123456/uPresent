import cv2
import os
import base64
import config
from resources.producer import connect_kafka_producer, publish_message


def videosplitter(key):
    try:
        cap = cv2.VideoCapture(config.Config.VIDEO_INPUT_PATH + key)
        cap.open(config.Config.VIDEO_INPUT_PATH + key)
        print('cap is opened', cap.isOpened())

        try:
            if not os.path.exists(config.Config.FRAMES_PATH):
                os.makedirs(config.Config.FRAMES_PATH)
        except OSError:
            print('Error: Creating directory of data')

        currentFrame = 0
        while cap.isOpened():
            # Capture frame-by-frame
            ret, frame = cap.read()

            # Convert frames into base64 encoded string
            ret, buffer = cv2.imencode('.jpg', frame)
            imageData = base64.b64encode(buffer)

            # Publishing frames to kafka topic
            kafka_producer = connect_kafka_producer()
            publish_message(kafka_producer, config.Config.KAFKA_TOPIC, 'frame', key, imageData)

            # Saves image of the current frame in jpg file
            name = config.Config.FRAMES_PATH + '/frame' + str(currentFrame) + '.jpg'
            print('Creating...' + name)
            cv2.imwrite(name, frame)

            # To stop duplicate images
            currentFrame += 1

    except Exception as ex:
        print('Exception while splitting video')
        print(str(ex))

    finally:
        # When everything done, release the capture
        cap.release()
        cv2.destroyAllWindows()