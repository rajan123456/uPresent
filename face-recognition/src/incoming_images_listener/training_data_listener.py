from handler import Handler, initialise_metadata_on_startup
import watchdog
import time 
import os
from flask import current_app
  
if __name__ == "__main__": 
    initialise_metadata_on_startup()
    event_handler = Handler() 
    observer = watchdog.observers.Observer() 
    observer.schedule(event_handler, path=current_app.config['DATASET_PATH'], recursive=True) 
    # observer.schedule(event_handler, path="./dataset", recursive=True) 
    observer.start() 
    try: 
        while True: 
            time.sleep(1) 
    except KeyboardInterrupt: 
        observer.stop() 
    observer.join()