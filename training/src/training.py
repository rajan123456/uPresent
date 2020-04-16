from sklearn.preprocessing import LabelEncoder
from sklearn.svm import SVC
import pickle
import constants

def train_model():
    recog = constants.PICKLE_FILES_DIR + '/recognizer.pickle'
    l = constants.PICKLE_FILES_DIR + '/le.pickle'
    embeddings = constants.PICKLE_FILES_DIR + '/embeddings.pickle'

    # load the face embeddings
    print("[INFO] loading face embeddings...")
    try:
        data = pickle.loads(open(embeddings, "rb").read())

        # encode the labels
        print("[INFO] encoding labels...")
        le = LabelEncoder()
        labels = le.fit_transform(data["names"])

        # train the model used to accept the 128-d embeddings of the face and
        # then produce the actual face recognition
        print("[INFO] training model...")
        recognizer = SVC(C=1.0, kernel="linear", probability=True)
        recognizer.fit(data["embeddings"], labels)

        # write the actual face recognition model to disk
        f = open(recog, "wb")
        f.write(pickle.dumps(recognizer))
        f.close()

        # write the label encoder to disk
        f = open(l, "wb")
        f.write(pickle.dumps(le))
        f.close()
    except Exception as ex:
        print(str(ex))
        return {"Exception occurred. Exception msg: ": str(ex)}, 500
