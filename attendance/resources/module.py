import urllib.request
from flask import current_app
import json
import logging
from datetime import date
import os


log = logging.getLogger('root')


def check_module_active(moduleCode):
    log.info("Trying to fetch module info by moduleCode")
    module_api = os.getenv('MODULE_API_FETCH_DETAILS')
    if module_api is None:
        module_api = current_app.config['MODULE_API_FETCH_DETAILS']
    moduleApiResponse = urllib.request.urlopen(module_api + moduleCode).read()
    moduleResponseData = json.loads(moduleApiResponse.decode('utf8')).get("data")
    if moduleResponseData is None:
        log.error('No data found for the moduleCode')
        raise Exception('No data found for the moduleCode')
    scheduled_days = moduleResponseData.get('scheduledDays')
    today = date.today().strftime('%A')
    if today not in scheduled_days:
        log.error('Module is not available for today')
        raise Exception('Module is not available today')
    return moduleResponseData