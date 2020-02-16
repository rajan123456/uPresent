package com.upresent.management.service;

import java.util.List;

import com.upresent.management.entity.UserDetail;
import com.upresent.management.exception.ManagementException;

public interface ManagementService {

	String addUser(UserDetail userDetail) throws ManagementException;

	List<UserDetail> fetchUsers(String username, String name, String userType) throws ManagementException;

	String updateUser(UserDetail userDetail) throws ManagementException;

	String deleteUser(String username) throws ManagementException;
}