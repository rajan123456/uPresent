import io
import logging
import config

import cv2
import numpy as np
from PIL import Image


def face_detection(image):
    try:
        pilImage = Image.open(io.BytesIO(image))
        gray = cv2.cvtColor(np.array(pilImage), cv2.COLOR_BGR2GRAY)
        faceCascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )
        faces = faceCascade.detectMultiScale(
            gray,
            scaleFactor=config.Config.RGB_SCALE_FACTOR,
            minNeighbors=config.Config.MIN_NEIGHBORS,
            minSize=(config.Config.MIN_HEIGHT, config.Config.MIN_WIDTH),
        )
        logging.warning("Found {0} Faces!".format(len(faces)))
        return len(faces)
    except Exception as ex:
        logging.warning(
            "Exception while processing images inside face detect method--->>"
        )
        logging.warning(str(ex))
        pass
