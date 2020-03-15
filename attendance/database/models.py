from .db import db
import datetime


class Attendance(db.Document):
    userId = db.StringField(required=True)
    location = db.PointField(required=True)
    school = db.StringField(required=False, default="NUS")
    date_captured = db.DateTimeField(default=datetime.datetime.utcnow)