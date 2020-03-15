from .db import db
import datetime


class Attendance(db.Document):
    userId = db.StringField(required=True, unique=True)
    location = db.PointField(required=True)
    date_captured = db.DateTimeField(default=datetime.datetime.utcnow)