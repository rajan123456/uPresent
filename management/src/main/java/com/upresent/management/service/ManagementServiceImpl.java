package com.upresent.management.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.upresent.management.entity.UserDetail;
import com.upresent.management.exception.ManagementException;
import com.upresent.management.repository.UserRepository;
import com.upresent.management.utils.CommonUtility;

public class ManagementServiceImpl implements ManagementService {

	@Autowired
	private UserRepository userRepository;

	@Override
	public String addUser(UserDetail userDetail) throws ManagementException {
		userRepository.save(userDetail);
		return "User added successfully!";
	}

	@Override
	public List<UserDetail> fetchUsers(String username, String name, String userType) throws ManagementException {
		if (CommonUtility.isValidString(username))
			return userRepository.findByUsername(username);

		if (CommonUtility.isValidString(name))
			return userRepository.findByName(name);

		if (CommonUtility.isValidString(userType))
			return userRepository.findByUserType(userType);

		return userRepository.findAll();
	}

	@Override
	public String updateUser(UserDetail userDetail) throws ManagementException {
		UserDetail existingDetails = fetchUsers(null, null, userDetail.getUsername()).get(0);
		existingDetails.setName(CommonUtility.isValidString(userDetail.getName())?
				userDetail.getName() : existingDetails.getName());
		existingDetails.setUsername(CommonUtility.isValidString(userDetail.getUsername())?
				userDetail.getUsername() : existingDetails.getUsername());
		userRepository.save(existingDetails);
		return "User data successfully updated!";
	}

	@Override
	public String deleteUser(String username) throws ManagementException {
		UserDetail userDetail = fetchUsers(null, null, username).get(0);
		userDetail.setIsActive(0);
		userRepository.save(userDetail);
		return "User data successfully deleted!";
	}

}