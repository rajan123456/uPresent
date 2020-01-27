package com.upresent.user.service;

import com.upresent.user.entity.UserDetail;
import com.upresent.user.exception.UserException;

public interface UserService {

	public String registerUser(UserDetail userDetail) throws UserException;

	public UserDetail fetchUser(String registrationNumber) throws UserException;

	public String updateUser(UserDetail userDetail) throws UserException;

	public String deleteUser(String registrationNumber) throws UserException;
	
}