import urllib.request
from flask import current_app
import json
import logging
from datetime import date

# set logging level for 'video Processor'
log = logging.getLogger('root')


def check_module_active(moduleCode):
    log.info("Trying to fetch module info by moduleCode ---->>")
    moduleApiResponse = urllib.request.urlopen(
        current_app.config['MODULE_API_FETCH_DETAILS'] + moduleCode).read()
    moduleResponseData = json.loads(moduleApiResponse.decode('utf8')).get("data")
    if moduleResponseData is None:
        raise Exception('No data found for the moduleCode')
    scheduled_days = moduleResponseData.get('scheduledDays')
    today = date.today().strftime('%A')
    if today not in scheduled_days:
        raise Exception('Module is not available today')
    return moduleResponseData