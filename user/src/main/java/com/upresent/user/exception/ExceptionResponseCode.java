package com.upresent.user.exception;

public enum ExceptionResponseCode {

	REQUEST_FLOODING(4005,"Multiple request with same data. Please try again."),
	GENRAL_ERROR(4006,"Your request could not be served by the system. Please try again."),
	UNAUTHORISED(4007, "Unauthorised access. Please retry with correct credentials."),
	MISSING_HEADER_KEY(4008,"Your request could not be served by the system. Please try again!"),
	TOKEN_REQUIRED(4009, "Token is missing or is incorrect"),
	USER_DATA_NOT_FOUND(4011, "User data not found."),
	USER_DATA_NOT_FOUND_IN_REQUEST(4012, "User data not found in request."),
	UPLOADING_FILE_FAILED(4013, "Your request could not be served by the system. Please try again.");

	private int code;

	private String description;

	public int getCode() {
		return code;
	}

	public String getDescription() {
		return description;
	}

	private ExceptionResponseCode(int code, String description) {
		this.code = code;
		this.description = description;
	}
}