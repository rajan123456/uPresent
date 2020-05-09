import urllib.request
from flask import current_app
import json
import logging
import os


log = logging.getLogger("root")


class User:
    def fetchStudent(self, username):
        log.info("Trying to fetch student info by username ---->>")
        userResponseData = self.fetchUser(username)
        if userResponseData is None or userResponseData.get("userType") != "STUDENT":
            raise Exception("User is not a student")
        return userResponseData

    def fetchAdmin(self, username):
        log.info("Trying to fetch admin info by username ---->>")
        userResponseData = self.fetchUser(username)
        if userResponseData is None or userResponseData.get("userType") != "ADMIN":
            raise Exception("User is not an admin")
        return userResponseData

    def fetchUser(self, username):
        log.info("Trying to fetch user info by username ---->>")
        user_api = os.getenv("USER_API_FETCH_USER")
        if user_api is None:
            user_api = current_app.config["USER_API_FETCH_USER"]
        userApiResponse = urllib.request.urlopen(user_api + username).read()
        userResponseData = json.loads(userApiResponse.decode("utf8")).get("data")
        if userResponseData is None:
            raise Exception("No data found for User")
        return userResponseData
