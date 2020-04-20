# Video Processor #

The uPresent mobile app allows students to register themselves by uploading their video. We need to reliably handle and efficiently process these large-scale video stream data .As part of the video stream processing pipeline, the VideoProcessor is a `Python` service which converts the video stream into image frames using `OpenCV` library and pushes these image frames to `Kafka` queue.
Below is the architecture diagram to further illustrate this :

![Video Processor](https://github.com/rajan123456/uPresent/blob/documentation/dipty/videoprocessor/VideoProcessor(1).jpg)

As shown in the above diagram, a student uploads his/her video for registration on uPresent mobile app. The video is then sent over `RTMP protocol` to `SRS Cluster`, along with a key. This key is nothing but the student's unique username. Here, RTMP is a Real-Time Messaging Protocol for streaming video or audio over internet
and SRS is an industrial-strength live streaming cluster.

After sending the video to SRS Cluster, subsequently, an API call is made to videoProcessor service to pull this video from SRS cluster. It is a `POST` method developed using `Python Flask`.

Now, The videoProcessor service on recieving this video stream from SRS Cluster, firstly, splits the video stream into number of image frames using OpenCV library.
These image frames are then Base64 encoded. After that, a JSON request object is constructed which contains base64 image string, username and timestamp. All these values are serialized before passing into the JSON request object.

Finally, a Kafka connection is setup and the JSON request is pushed to the **"VideoCollector"** Kafka Topic through the Kafka producer. 

This stream of image frames is then consumed from kafka topic by our **streamProcessor** service for further processing.

***SWAGGER URL :***



