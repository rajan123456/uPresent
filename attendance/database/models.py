from .db import db
import datetime


class Attendance(db.Document):
    username = db.StringField(required=True)
    location = db.ListField(required=True)
    school = db.StringField(required=False, default="NUS")
    capturedImageId = db.StringField(required=True)
    moduleId = db.StringField(required=True)
    date_captured = db.DateTimeField(default=datetime.datetime.utcnow)