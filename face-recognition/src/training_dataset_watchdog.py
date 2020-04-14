from handler import Handler, initialise_metadata_on_startup
import watchdog
import time
import constants
  
if __name__ == "__main__": 
    initialise_metadata_on_startup()
    event_handler = Handler() 
    observer = watchdog.observers.Observer() 
    observer.schedule(event_handler, path=constants.DATASET_PATH, recursive=True)
    observer.start()
    try: 
        while True: 
            time.sleep(1) 
    except KeyboardInterrupt: 
        observer.stop() 
    observer.join()