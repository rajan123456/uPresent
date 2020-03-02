package com.upresent.metrics.exception;

import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;

public class MetricsException extends RuntimeException {

	private static final long serialVersionUID = -3774564054778726161L;

	public static final HttpStatus DEFAULT_HTTP_STATUS = HttpStatus.INTERNAL_SERVER_ERROR;

	public static final String DEFAULT_MESSAGE = "Something Bad Happened!";

	private HttpStatus httpStatus;

	private String message;

	private ExceptionResponseCode responseCode;

	public ExceptionResponseCode getResponseCode() {
		return responseCode;
	}

	public void setResponseCode(ExceptionResponseCode ResponseCode) {
		if(ResponseCode != null) {
			message = ResponseCode.getDescription();
		}else {
			message = DEFAULT_MESSAGE;
		}
		this.responseCode = ResponseCode;
	}

	public HttpStatus getHttpStatus() {
		return httpStatus;
	}

	public void setHttpStatus(HttpStatus httpStatus) {
		this.httpStatus = httpStatus;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public MetricsException(HttpStatus httpStatus, String message) {
		super();
		this.httpStatus = httpStatus == null ? DEFAULT_HTTP_STATUS : httpStatus;
		this.message = StringUtils.isEmpty(message) ? DEFAULT_MESSAGE : message;
	}

	public MetricsException(String message) {
		this(DEFAULT_HTTP_STATUS, message);
	}

	public MetricsException() {
		this(DEFAULT_HTTP_STATUS, DEFAULT_MESSAGE);
	}

	public MetricsException(ExceptionResponseCode err) {
		super();
		this.setResponseCode(err);		
	}

	public MetricsException(ExceptionResponseCode err, String errorMessage) {
		super();
		this.responseCode = err;
		this.message = errorMessage;
	}

}
