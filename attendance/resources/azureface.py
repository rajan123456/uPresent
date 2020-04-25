import os
import logging

from azure.cognitiveservices.vision.face import FaceClient
from flask import current_app
from msrest.authentication import CognitiveServicesCredentials

from resources.vault import obtain_data

log = logging.getLogger('root')


def compare_faces_azure(targetId, sourceId):
    log.info("Trying to compare faces for student attendance with AZURE Face ---->>")
    secrets = obtain_data()
    # Create an authenticated FaceClient.
    face_client = FaceClient(secrets['azure_face_endpoint'], CognitiveServicesCredentials(current_app.config.AZURE_FACE_ENDPOINT))

    image_source = open(current_app.config['UPLOAD_DIR'] + sourceId, 'r+b')
    image_target = open(current_app.config['UPLOAD_DIR'] + targetId, 'r+b')

    detected_faces_source = face_client.face.detect_with_stream(image_source)
    source_image_id = detected_faces_source[0].face_id

    detected_faces_target = face_client.face.detect_with_stream(image_target)
    target_image_id = detected_faces_target[0].face_id

    verify_result_same = face_client.face.verify_face_to_face(source_image_id, target_image_id)

    log.info("Faces confidence measure is " + verify_result_same.confidence)

    image_source.close()
    image_target.close()

    if not (verify_result_same.confidence * 100) < current_app.config.THRESHOLD_CONFIDENCE:
        log.error('Image mismatch found in azure face!')
        raise Exception('Image mismatch found!')
