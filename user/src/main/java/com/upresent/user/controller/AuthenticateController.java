package com.upresent.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.upresent.user.pojo.LoginRequest;
import com.upresent.user.service.AuthenticateService;
import com.upresent.user.utils.RestResponse;
import com.upresent.user.utils.RestUtils;

@RestController
@RequestMapping(value = "/auth")
public class AuthenticateController {

	@Autowired
	private AuthenticateService authenticateService;

	@PostMapping
	public ResponseEntity<RestResponse<String>> loginUser(
			@RequestBody LoginRequest loginRequest) {
		return RestUtils.successResponse(authenticateService.loginUser(loginRequest));
	}
}
