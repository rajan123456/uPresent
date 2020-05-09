# import the necessary packages
from imutils import paths
import numpy as np
import imutils
import pickle
import cv2
import os
import constants
import logging

log = logging.getLogger("root")


def extract_embeddings():
    log.info("embeddings extraction started.")
    embeddings = constants.PICKLE_FILES_DIR + "/embeddings.pickle"
    embedding_model = constants.MODEL_FILES_DIR + "/openface_nn4.small2.v1.t7"
    # load our serialized face detector from disk
    log.info("[INFO] loading face detector...")
    try:
        proto_path = constants.MODEL_FILES_DIR + "/deploy.prototxt"
        model_path = (
            constants.MODEL_FILES_DIR + "/res10_300x300_ssd_iter_140000.caffemodel"
        )
        detector = cv2.dnn.readNetFromCaffe(proto_path, model_path)

        # load our serialized face embedding model from disk
        log.info("[INFO] loading face recognizer...")
        embedder = cv2.dnn.readNetFromTorch(embedding_model)

        # grab the paths to the input images in our dataset
        log.info("[INFO] quantifying faces...")
        image_paths = list(paths.list_images(constants.DATASET_PATH))

        # initialize our lists of extracted facial embeddings and
        # corresponding people names
        known_embeddings = []
        known_names = []

        # initialize the total number of faces processed
        total = 0

        # loop over the image paths
        for (i, image_path) in enumerate(image_paths):
            # extract_embeddings the person name from the image path
            log.info("[INFO] processing image {}/{}".format(i + 1, len(image_paths)))
            name = image_path.split(os.path.sep)[-2]

            # load the image, resize it to have a width of 600 pixels (while
            # maintaining the aspect ratio), and then grab the image
            # dimensions
            image = cv2.imread(image_path)
            if image is None:
                log.warn(
                    "\n\n\nthis image was skipped because its size is 0:" + image_path
                )
                continue
            image = imutils.resize(image, width=600)
            (h, w) = image.shape[:2]

            # construct a blob from the image
            image_blob = cv2.dnn.blobFromImage(
                cv2.resize(image, (300, 300)),
                1.0,
                (300, 300),
                (104.0, 177.0, 123.0),
                swapRB=False,
                crop=False,
            )

            # apply OpenCV's deep learning-based face detector to localize
            # faces in the input image
            detector.setInput(image_blob)
            detections = detector.forward()

            # ensure at least one face was found
            if len(detections) > 0:
                # we're making the assumption that each image has only ONE
                # face, so find the bounding box with the largest probability
                i = np.argmax(detections[0, 0, :, 2])
                confidence = detections[0, 0, i, 2]

                # ensure that the detection with the largest probability also
                # means our minimum probability test (thus helping filter out
                # weak detections)
                if confidence > constants.CONFIDENCE_THRESHOLD:
                    # compute the (x, y)-coordinates of the bounding box for
                    # the face
                    box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                    (startX, startY, endX, endY) = box.astype("int")

                    # extract_embeddings the face ROI and grab the ROI dimensions
                    face = image[startY:endY, startX:endX]
                    (fH, fW) = face.shape[:2]

                    # ensure the face width and height are sufficiently large
                    if fW < 20 or fH < 20:
                        continue

                    # construct a blob for the face ROI, then pass the blob
                    # through our face embedding model to obtain the 128-d
                    # quantification of the face
                    face_blob = cv2.dnn.blobFromImage(
                        face, 1.0 / 255, (96, 96), (0, 0, 0), swapRB=True, crop=False
                    )
                    embedder.setInput(face_blob)
                    vec = embedder.forward()

                    # add the name of the person + corresponding face
                    # embedding to their respective lists
                    known_names.append(name)
                    known_embeddings.append(vec.flatten())
                    total += 1

        # dump the facial embeddings + names to disk
        log.info("[INFO] serializing {} encodings...".format(total))
        data = {"embeddings": known_embeddings, "names": known_names}
        f = open(embeddings, "wb")
        f.write(pickle.dumps(data))
        f.close()
    except Exception as ex:
        log.error(
            "Exception occurred while trying to extract embeddings. Exception msg: "
            + str(ex)
        )
        return {"Exception occurred. Exception msg: ": str(ex)}, 500
