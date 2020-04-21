package com.upresent.user.utils;

public interface Constant {
	Integer SUCCESS_STATUS = 200;
	Integer FAILURE_STATUS = 101;
	Integer ACTIVE_STATUS = 1;
	Integer INACTIVE_STATUS = 0;
	String USER_PUBLISHER_TOPIC = "user.publisher.topic";
	String KAFKA_BOOTSTRAP_ADDRESS = "kafka.bootstrap.address";
	String USER_SOURCE_ID = "1";
	String USER_CREATED_EVENT = "userCreated";
	String USER_UPDATED_EVENT = "userUpdated";
	String USER_DELETED_EVENT = "userDeleted";
	String SAGA_ENABLED_ENV_VARIABLE = "sagaEnabled";
}