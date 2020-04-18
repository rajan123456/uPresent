from database.db import initialize_db
from elasticapm.contrib.flask import ElasticAPM
from flask import Flask
from flask_restful import Api
from flask_restful_swagger import swagger
from resources.routes import initialize_routes
from flask_cors import CORS
from resources import custom_logger
import logging

# Initializing custom logger
log = logging.getLogger('root')
log.setLevel(logging.INFO)
log.addHandler(custom_logger.LogHandler())

app = Flask(__name__)
CORS(app)
app.config.from_object("config.Config")

apm = ElasticAPM(app)
api = Api(app)
api = swagger.docs(Api(app), apiVersion='0.1')

initialize_db(app)
initialize_routes(api)
app.run(host='0.0.0.0')
