package com.upresent.user.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.upresent.user.utils.CommonUtility;
import com.upresent.user.utils.RestUtils;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {
	private static final Logger log = LoggerFactory.getLogger(RestExceptionHandler.class);

	@ExceptionHandler(value = {Exception.class})
	protected ResponseEntity<?> handleUnknownException(Exception ex, WebRequest request) {
		log.error(ex.getMessage(), ex);
		return RestUtils.errorResponseEntity(ExceptionResponseCode.GENERAL_ERROR.getDescription(),
				UserException.DEFAULT_HTTP_STATUS);
	}

	@ExceptionHandler(value = {UserException.class})
	protected ResponseEntity<?> handleknownException(UserException ex, WebRequest request) {
		if(!CommonUtility.isNullObject(ex.getResponseCode())){
			log.error("Custom Exception:: Error Code :: {} Custom Exception:: Error Description {}",ex.getResponseCode().getCode(), ex.getResponseCode().getDescription());
		}else{
			log.error("General Exception:: Error Description {} ",ex.getMessage());
		}
		return RestUtils.errorResponseData((CommonUtility.isNullObject(ex.getResponseCode())?
				ExceptionResponseCode.GENERAL_ERROR : ex.getResponseCode()), HttpStatus.OK,ex.getMessage());
	}

	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		return new ResponseEntity<>(ExceptionResponseCode.GENERAL_ERROR.getDescription(), HttpStatus.BAD_REQUEST);
	}

}