FROM openjdk:17-alpine

ARG JAR_FILE=target/*.jar
ARG ELASTIC_AGENT=lib/*.jar

COPY ${JAR_FILE} app.jar
COPY ${ELASTIC_AGENT} elastic-apm-agent-1.14.0.jar

ENTRYPOINT ["java","-javaagent:elastic-apm-agent-1.14.0.jar", "-Delastic.apm.service_name=user-service", "-Delastic.apm.application_packages=com.upresent.user", "-Delastic.apm.server_urls=http://apm-server:8200", "-jar", "app.jar"]
