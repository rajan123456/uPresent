import urllib.request
from flask import current_app
import datetime
import json
import logging
import os
import pytz


log = logging.getLogger("root")


def check_module_active(moduleCode, timeZone):
    log.info("Trying to fetch module info by moduleCode")
    module_api = os.getenv("MODULE_API_FETCH_DETAILS")
    if module_api is None:
        module_api = current_app.config["MODULE_API_FETCH_DETAILS"]
    moduleApiResponse = urllib.request.urlopen(module_api + moduleCode).read()
    moduleResponseData = json.loads(moduleApiResponse.decode("utf8")).get("data")
    if moduleResponseData is None:
        log.error("No data found for the moduleCode")
        raise Exception("No data found for the moduleCode")
    schedule = moduleResponseData.get("schedule")
    today = datetime.datetime.now(pytz.timezone(timeZone)).strftime("%m/%d/%Y")
    flag = False
    for _sched in schedule:
        if _sched.get("date") == today:
            if (
                datetime.datetime.strptime(_sched.get("startTime"), "%H:%M").time()
                <= datetime.datetime.now(pytz.timezone(timeZone)).time()
                and datetime.datetime.strptime(_sched.get("endTime"), "%H:%M").time()
                >= datetime.datetime.now(pytz.timezone(timeZone)).time()
            ):
                flag = True
            else:
                log.info(
                    "Start Time: "
                    + str(_sched.get("startTime"))
                    + ", End Time: "
                    + str(_sched.get("endTime"))
                    + ", Current Time: "
                    + str(
                        datetime.datetime.now(pytz.timezone(timeZone)).strftime("%H:%M")
                    )
                    + ", Timezone: "
                    + str(timeZone)
                )
                log.error("Module schedule lapsed for the day")
                raise Exception("Module schedule lapsed for the day")
            break
    if not flag:
        log.error("Module is not scheduled for today")
        raise Exception("Module is not scheduled for today")
    return moduleResponseData
