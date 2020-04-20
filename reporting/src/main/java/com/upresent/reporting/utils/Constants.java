package com.upresent.reporting.utils;

public interface Constants {
	Integer SUCCESS_STATUS = 200;
	Integer FAILURE_STATUS = 101;
	String KAFKA_BOOTSTRAP_ADDRESS = "kafka.bootstrap.address";
	String REPORTING_SERVICE_SUBSCRIBER = "reporting.subscriber";
	String ATTENDANCE_SERVICE_SOURCE_ID = "3";
	String DATE_FORMAT = "MM/dd/yyyy";
	String REPORTING_TIMESTAMP_FORMAT = "MM/dd/yyyy, HH:mm:ss";
	String FETCH_MODULE_DETAILS_API_URL = "/manage/module?moduleCode=";
	String MANAGEMENT_MS_HOSTNAME_ENV_VARIABLE = "managementms.hostname";
	String MANAGEMENT_MS_PORT_ENV_VARIABLE = "managementms.port";
}