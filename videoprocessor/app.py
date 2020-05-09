from flask import Flask
from flask_restful import Api
from elasticapm.contrib.flask import ElasticAPM
from flask_restful_swagger import swagger
from resources import custom_logger
from resources.routes import initialize_routes
import logging

app = Flask(__name__)
app.config.from_object("config.Config")

# Initializing custom logger
log = logging.getLogger("root")
log.setLevel(logging.INFO)
log.addHandler(custom_logger.LogHandler())

apm = ElasticAPM(app)
api = Api(app)
api = swagger.docs(Api(app), apiVersion="0.1")
initialize_routes(api)

app.run(host="0.0.0.0")
