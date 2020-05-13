package com.upresent.management.utils;

public interface Constant {
	Integer SUCCESS_STATUS = 200;
	Integer FAILURE_STATUS = 101;
	String MANAGEMENT_PUBLISHER_TOPIC = "management.publisher.topic";
	String KAFKA_BOOTSTRAP_ADDRESS = "kafka.bootstrap.address";
	String MANAGEMENT_SOURCE_ID = "2";
	String SCHOOL_CREATED_EVENT = "schoolCreated";
	String SCHOOL_UPDATED_EVENT = "schoolUpdated";
	String SCHOOL_DELETED_EVENT = "schoolDeleted";
	String MODULE_CREATED_EVENT = "moduleCreated";
	String MODULE_UPDATED_EVENT = "moduleUpdated";
	String MODULE_DELETED_EVENT = "moduleDeleted";
	String FETCH_USER_API_URL = "/user?username=";
	String FETCH_USER_TYPES_API_URL = "/user/get-type";
	String USER_MS_HOSTNAME_ENV_VARIABLE = "userms.hostname";
	String USER_MS_PORT_ENV_VARIABLE = "userms.port";
	String SAGA_ENABLED_ENV_VARIABLE = "sagaEnabled";
}