import watchdog.events
import watchdog.observers
import os
from flask import current_app

# dict of the type String: Integer (username: imageCount)
students_image_count = {}

class Handler(watchdog.events.PatternMatchingEventHandler):

    def __init__(self):
        watchdog.events.PatternMatchingEventHandler.__init__(self, patterns=['*.png', '*.PNG'], 
                                                             ignore_directories=False, case_sensitive=True) 

    # def on_any_event(self, event):
    #     print(event.src_path, event.event_type)

    def on_created(self, event):
        # New png image created
        print("New image received: %s." % event.src_path)
        update_training_metadata(event.src_path)

def update_training_metadata(path):
    isValid, username, file_name = check_validity_and_get_details(path)
    if isValid:
        if username in students_image_count:
            students_image_count[username] += 1
        else:
            students_image_count[username] = 1
        print(students_image_count)
    else:
        print("Image was not added at the expected path (./dataset/<username>/). Image path: " + path)
    check_and_begin_training()
    
def check_and_begin_training():
    start_training = True
    for username in students_image_count.keys():
        if students_image_count[username] != 2:
        # if students_image_count[username] != current_app.config['USER_TRAINING_IMAGE_COUNT']:
            start_training = False
            break
    if start_training:
        initialise_training()

def check_validity_and_get_details(path):
    split_path = path.split("/")
    if(len(split_path) == 4):
        return True, split_path[2], split_path[3]
    return False, "", ""

def initialise_training():
    print("training started")

def initialise_metadata_on_startup():
    dataset_path = current_app.config['DATASET_PATH']
    # print(dataset_path)
    # dataset_path = "./dataset"
    for username in os.listdir(dataset_path):
        concatenated_dir = dataset_path + '/' + username
        if os.path.isdir(concatenated_dir):
            students_image_count[username] = len([file for file in os.listdir(concatenated_dir) if (os.path.isfile(concatenated_dir + "/" + file) and os.path.splitext(file)[1].lower() == ".png")])
    print(students_image_count)