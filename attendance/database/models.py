from .db import db
import datetime
from mongoengine import *



class Attendance(db.Document):
    userId = db.StringField(required=True, unique=True)
    location = PointField(required=True)
    date_captured = db.DateTimeField(default=datetime.datetime.utcnow)