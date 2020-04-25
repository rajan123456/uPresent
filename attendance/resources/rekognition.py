import boto3
import logging
from flask import current_app
from resources.vault import obtain_data

log = logging.getLogger('root')


def compare_faces_rekognition(targetId, sourceId):
    log.info("Trying to compare faces for student attendance with AWS Rekognition ---->>")
    secrets = obtain_data()
    client = boto3.client('rekognition',
                          aws_access_key_id=secrets['aws_access_key_id'],
                          aws_secret_access_key=secrets['aws_secret_access_key'],
                          region_name='us-west-2')

    image_source = open(current_app.config['UPLOAD_DIR']+sourceId, 'rb')
    image_target = open(current_app.config['UPLOAD_DIR']+targetId, 'rb')
    response = client.compare_faces(SimilarityThreshold=current_app.config['THRESHOLD_CONFIDENCE'],
                                    SourceImage={'Bytes': image_source.read()},
                                    TargetImage={'Bytes': image_target.read()})

    similarity = '0'
    for faceMatch in response['FaceMatches']:
        similarity = str(faceMatch['Similarity'])
        log.info(" Facial recognition with AWS Rekognition confidence rating is" + str(similarity))
    image_source.close()
    image_target.close()
    if similarity == '0':
        log.error('Image mismatch found in aws rekognition!')
        raise Exception('Image mismatch found!')