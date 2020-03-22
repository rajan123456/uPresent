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
	String MODULE_CREATED_EVENT = "moduleCreated";
	String MODULE_UPDATED_EVENT = "moduleUpdated";
	String UNIVERSITY_NAME = "NUS";
	String FETCH_USER_API_URL = "/user?username=";
	String FETCH_USER_TYPES_API_URL = "/user/get-type";
}