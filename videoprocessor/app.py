from flask import Flask
from flask_restful import Api
from elasticapm.contrib.flask import ElasticAPM
from flask_restful_swagger import swagger


app = Flask(__name__)
app.config.from_object("config.Config")

apm = ElasticAPM(app)
api = Api(app)
api = swagger.docs(Api(app), apiVersion='0.1')

if __name__ == '__main__':
    app.run(host='0.0.0.0')