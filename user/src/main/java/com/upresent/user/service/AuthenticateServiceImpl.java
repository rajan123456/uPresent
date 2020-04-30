package com.upresent.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.upresent.user.entity.UserDetail;
import com.upresent.user.exception.ExceptionResponseCode;
import com.upresent.user.exception.UserException;
import com.upresent.user.pojo.LoginRequest;

@Service
public class AuthenticateServiceImpl implements AuthenticateService {

	@Autowired
	private UserService userService;

	@Override
	public String loginUser(LoginRequest loginRequest) {
		UserDetail user = userService.fetchUser(loginRequest.getUsername());
		if (!user.getPassword().equals(loginRequest.getPassword()) || !user.getIsActive().equals(1))
			throw new UserException(ExceptionResponseCode.UNAUTHORISED);
		return user.getUserType();
	}
}