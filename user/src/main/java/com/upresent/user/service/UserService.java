package com.upresent.user.service;

import java.util.List;
import java.util.Map;

import com.upresent.user.entity.UserDetail;
import com.upresent.user.exception.UserException;

public interface UserService {

	public String registerUser(UserDetail userDetail) throws UserException;

	public UserDetail fetchUser(String username) throws UserException;

	public Iterable<UserDetail> fetchAllUsers() throws UserException;

	public String updateUser(UserDetail userDetail) throws UserException;

	public String deleteUser(String username) throws UserException;

	public Map<String, Object> getUserType(List<String> usernames);

    public Iterable<UserDetail> fetchAllUsersOfType(String userType);
}