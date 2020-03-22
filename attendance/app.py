from flask import Flask
from database.db import initialize_db
from flask_restful import Api
from resources.routes import initialize_routes

app = Flask(__name__)
app.config.from_object("config.Config")
api = Api(app)

initialize_db(app)
initialize_routes(api)
app.run(host='0.0.0.0')