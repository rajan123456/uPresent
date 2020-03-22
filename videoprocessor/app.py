from flask import Flask, jsonify
from flask_restful import Resource, Api
from flask_restful_swagger import swagger
from elasticapm.contrib.flask import ElasticAPM

app = Flask(__name__)
app.config.from_object("config.Config")

apm = ElasticAPM(app)
api = Api(app)

###################################
# Wrap the Api with swagger.docs. It is a thin wrapper around the Api class that adds some swagger smarts
api = swagger.docs(Api(app), apiVersion="0.1")
###################################


class HelloWorld(Resource):
    @swagger.operation()
    def get(self):
        return {"hello": "world"}


api.add_resource(HelloWorld, "/")

if __name__ == "__main__":
    app.run(host="0.0.0.0")
