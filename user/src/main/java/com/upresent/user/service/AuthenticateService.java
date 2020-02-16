package com.upresent.user.service;

import com.upresent.user.pojo.LoginRequest;

public interface AuthenticateService {

	String loginUser(LoginRequest loginRequest);

}