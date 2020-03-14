# uPresent Attendance Service

This repository is for the attendance service of uPresent

## Local Setup Steps

NOTE: 
1. Local machine setup does not support https.
2. This project runs on Mongo running on localhost:27017 with no auth.

Steps:
1. Clone this git repository to your local machine.
2. Run the command in the attendance folder "docker build -t attendance:latest ."
3. After successful build, run command "docker run -d -p 5000:5000 attendance:latest"