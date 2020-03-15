package com.upresent.management.utils;

public interface Constant {
	Integer SUCCESS_STATUS = 200;
	Integer FAILURE_STATUS = 101;
	String MANAGEMENT_PUBLISHER_TOPIC = "management.publisher.topic";
	String KAFKA_BOOTSTRAP_ADDRESS = "kafka.bootstrap.address";
	String MANAGEMENT_SOURCE_ID = "2";
	String USER_CREATED_EVENT = "userCreated";
	String USER_UPDATED_EVENT = "userUpdated";
	String USER_DELETED_EVENT = "userDeleted";
	String GEO_FENCE_CREATED_OR_UPDATED_EVENT = "geoFenceCreatedOrUpdated";
	String UNIVERSITY_NAME = "NUS";
	String USER_MS_HOSTNAME = "http://localhost";
	String USER_MS_PORT = "8083";
	String FETCH_USER_API_URL = "/user?username=";
}