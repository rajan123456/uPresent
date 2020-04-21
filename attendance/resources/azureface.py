import os
import logging

from azure.cognitiveservices.vision.face import FaceClient
from flask import current_app
from msrest.authentication import CognitiveServicesCredentials

KEY = current_app.config['AZURE_FACE_SUBSCRIPTION_KEY']
ENDPOINT = current_app.config['AZURE_FACE_ENDPOINT']

log = logging.getLogger('root')


def compare_faces_azure(targetId, sourceId):
    # Create an authenticated FaceClient.
    face_client = FaceClient(ENDPOINT, CognitiveServicesCredentials(KEY))

    image_source = open(current_app.config['UPLOAD_DIR'] + sourceId, 'r+b')
    image_target = open(current_app.config['UPLOAD_DIR'] + targetId, 'r+b')

    detected_faces_source = face_client.face.detect_with_stream(image_source)
    source_image_id = detected_faces_source[0].face_id

    detected_faces_target = face_client.face.detect_with_stream(image_target)
    target_image_id = detected_faces_target[0].face_id

    verify_result_same = face_client.face.verify_face_to_face(source_image_id, target_image_id)
    print('Faces from {} & {} are of the same person, with confidence: {}'
          .format(image_source, image_target, verify_result_same.confidence)
          if verify_result_same.is_identical
          else 'Faces from {} & {} are of a different person, with confidence: {}'
          .format(image_source, image_target, verify_result_same.confidence))
    log.info("Faces confidence measure is " + verify_result_same.confidence)

    image_source.close()
    image_target.close()

    return verify_result_same.is_identical
