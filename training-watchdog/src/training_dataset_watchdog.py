import os
import time
import constants
from training import train_model
from embeddings import extract_embeddings
import logging
import schedule
import log_config

# Initializing custom logger
log = logging.getLogger('root')
log.setLevel(logging.INFO)
log.addHandler(log_config.LogHandler())

log = logging.getLogger('root')
log.info("Watchdog started.")

def job():

    students_image_count_obj = {}
    try:
        for username in os.listdir(constants.DATASET_PATH):
            concatenated_dir = constants.DATASET_PATH + '/' + username
            if os.path.isdir(concatenated_dir):
                students_image_count_obj[username] = len([file for file in os.listdir(concatenated_dir) if (
                            os.path.isfile(concatenated_dir + "/" + file) and os.path.splitext(file)[
                        1].lower() == constants.SUPPORTED_FILE_TYPE)])
        start_training = True
        for username in students_image_count_obj.keys():
            if students_image_count_obj[username] != constants.USER_TRAINING_IMAGE_COUNT:
                start_training = False
                break
        # check if any new user is added, i.e. is there really any need of training again.
        if start_training:
            students_count = len(students_image_count_obj.keys())
            if students_count > constants.ALREADY_TRAINED_STUDENTS_COUNT:
                constants.ALREADY_TRAINED_STUDENTS_COUNT = students_count
            else:
                log.info("Training terminated to avoid redundant trainings.")
                start_training = False
        else:
            log.info("Training didn't start because of insufficient number of images.")
            log.info("Metadata: " + str(students_image_count_obj))
        if start_training:
            log.info("Initialising model's training.")
            extract_embeddings()
            train_model()
    except KeyboardInterrupt:
        log.error("Training process' polling job interrupted.")

schedule.every(constants.FILE_SYSTEM_POLLING_DELAY_IN_SECONDS).seconds.do(job)

while True:
    schedule.run_pending()