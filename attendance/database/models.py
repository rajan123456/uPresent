from .db import db
import datetime


class Attendance(db.Document):
    userId = db.StringField(required=True)
    location = db.ListField(required=True)
    school = db.StringField(required=False, default="NUS")
    moduleId = db.StringField(required=True)
    date_captured = db.DateTimeField(default=datetime.datetime.utcnow)