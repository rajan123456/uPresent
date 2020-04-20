# uPresent Attendance Service

This repository is for the attendance service of uPresent

## Local Setup Steps
NOTE: 
1. Use PyCharm or Visual Code as the IDE for faster dev.

Steps:
1. Clone this git repository to your local machine.
2. Install python, pip and pipenv.
3. Run command "pipenv install flask", "pipenv install flask_restful" and "pipenv install flask-mongoengine"
4. Run application with command "flask run". Process will run on http://127.0.0.1:5000/

## Local Run Steps

NOTE: 
1. Local machine setup does not support https.
2. This project runs on Mongo running on localhost:27017 with no auth.

Steps:
1. Clone this git repository to your local machine.
2. Run the command in the attendance folder "docker build -t attendance:latest ."
3. After successful build, run command "docker run -d -p 5000:5000 attendance:latest"

## Swagger
http://{host}:{port}/api/spec.html