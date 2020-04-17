import io
import logging

import cv2
import numpy as np
from PIL import Image


def face_detection(image):
    try:
        pilImage = Image.open(io.BytesIO(image))
        gray = cv2.cvtColor(np.array(pilImage), cv2.COLOR_BGR2GRAY)
        faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        faces = faceCascade.detectMultiScale(
            gray,
            scaleFactor=1.3,
            minNeighbors=3,
            minSize=(30, 30)
        )
        logging.warning("Found {0} Faces!".format(len(faces)))
        return len(faces)
    except Exception as ex:
        logging.warning('Exception while processing images inside face detect method--->>')
        logging.warning(str(ex))
        pass

