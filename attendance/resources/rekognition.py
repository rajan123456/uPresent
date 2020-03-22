import boto3
from flask import current_app


def compare_faces(targetId, sourceId):
    return 'success'
    client = boto3.client('rekognition',
                          aws_access_key_id="test",
                          aws_secret_access_key="test",
                          region_name='us-west-2')
    imageSource = open(current_app.config['UPLOAD_DIR']+sourceId, 'rb')
    imageTarget = open(current_app.config['UPLOAD_DIR']+targetId, 'rb')

    response = client.compare_faces(SimilarityThreshold=60,
                                    SourceImage={'Bytes': imageSource.read()},
                                    TargetImage={'Bytes': imageTarget.read()})

    for faceMatch in response['FaceMatches']:
        similarity = str(faceMatch['Similarity'])
    imageSource.close()
    imageTarget.close()
    if similarity > current_app.config['THRESHOLD_CONFIDENCE']:
        raise Exception('Image mismatch found!')