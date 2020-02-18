package com.upresent.user.utils;

public interface Constant {
	Integer SUCCESS_STATUS = 200;
	Integer FAILURE_STATUS = 101;
	String USER_PUBLISHER_TOPIC = "user.publisher.topic";
	String KAFKA_BOOTSTRAP_ADDRESS = "kafka.bootstrap.address";
	String USER_SOURCE_ID = "1";
	String USER_CREATED_EVENT = "userCreated";
	String USER_UPDATED_EVENT = "userUpdated";
	String USER_DELETED_EVENT = "userDeleted";
}