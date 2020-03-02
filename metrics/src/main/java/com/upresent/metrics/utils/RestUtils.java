package com.upresent.metrics.utils;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.upresent.metrics.exception.ExceptionResponseCode;

@Component
public class RestUtils {

	public static <T> ResponseEntity<RestResponse<T>> successResponse(T data, String message, HttpStatus statusCode) {
		RestResponse<T> response = new RestResponse<T>(message, Constant.SUCCESS_STATUS, data);
		return new ResponseEntity<RestResponse<T>>(response, statusCode);
	}

	public static <T> ResponseEntity<RestResponse<T>> successResponse(T data) {
		return successResponse(data, "ok", HttpStatus.OK);
	}

	public static <T> ResponseEntity<RestResponse<T>> successResponse(T data, String message) {
		return successResponse(data, message, HttpStatus.OK);
	}

	public static <T> ResponseEntity<RestResponse<?>> errorResponseEntity(String errorMessage,
			HttpStatus statusCode) {
		return new ResponseEntity<RestResponse<?>>(new RestResponse<T>(errorMessage, Constant.FAILURE_STATUS, null), statusCode);
	}

	public static <T> ResponseEntity<String> errorForMB(String errorMessage,
			HttpStatus statusCode) {
		return new ResponseEntity<String>(errorMessage, statusCode);
	}

	public static <T> ResponseEntity<RestResponse<?>> errorResponseData(ExceptionResponseCode routerResponseCode,
			HttpStatus statusCode, String message) {
		RestResponse<T> response = new RestResponse<T>(CommonUtility.isValidString(message)? message : routerResponseCode.getDescription(), routerResponseCode.getCode(), null);
		return new ResponseEntity<RestResponse<?>>(response, statusCode);
	}

	public static <T> RestResponse<?> errorResponseData(String errorMessage) {
		return new RestResponse<T>(errorMessage, Constant.FAILURE_STATUS, null);
	}

	public static <T> RestResponse<?> errorResponseEnum(ExceptionResponseCode routerResponseCode) {
		return new RestResponse<T>(routerResponseCode.getDescription(), routerResponseCode.getCode(), null);
	}

	public String convertObjectToJson(Object object) throws JsonProcessingException {
		if (object == null) {
			return null;
		}
		ObjectMapper mapper = new ObjectMapper();
		return mapper.writeValueAsString(object);
	}

}