from .db import db
import datetime


class Attendance(db.Document):
    username = db.StringField(required=True)
    location = db.ListField(required=True)
    school = db.StringField(required=True)
    capturedImageId = db.StringField(required=True)
    moduleId = db.StringField(required=True)
    status = db.StringField()
    recognitionSource = db.StringField()
    recognitionConfidence = db.StringField()
    date_captured = db.DateTimeField(
        default=datetime.datetime.now().replace(
            hour=0, minute=0, second=0, microsecond=0
        )
    )
    time_captured = db.DateTimeField(default=datetime.datetime.now())
