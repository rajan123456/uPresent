import cv2
import os
import ffmpeg


def videosplitter():
    cap = cv2.VideoCapture('./inputData/example.mp4')
    cap.open('./inputData/example.mp4')
    print('cap is opened', cap.isOpened())

    try:
        if not os.path.exists('data'):
            os.makedirs('data')
    except OSError:
        print('Error: Creating directory of data')

    currentFrame = 0
    while cap.isOpened():
        # Capture frame-by-frame
        ret, frame = cap.read()

        # Saves image of the current frame in jpg file
        name = './data/frame' + str(currentFrame) + '.jpg'
        print('Creating...' + name)
        cv2.imwrite(name, frame)

        # To stop duplicate images
        currentFrame += 1

    # When everything done, release the capture
    cap.release()
    cv2.destroyAllWindows()
