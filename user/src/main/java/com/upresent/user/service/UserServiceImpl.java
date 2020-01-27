package com.upresent.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.upresent.user.entity.UserDetail;
import com.upresent.user.exception.ExceptionResponseCode;
import com.upresent.user.exception.UserException;
import com.upresent.user.repository.UserRepository;
import com.upresent.user.utils.CommonUtility;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepository;

	@Override
	public String registerUser(UserDetail userDetail) throws UserException {
		userRepository.save(userDetail);
		return "User registered successfully!";
	}

	@Override
	public UserDetail fetchUser(String registrationNumber) throws UserException {
		List<UserDetail> userDetails = userRepository.findByRegistrationNumber(registrationNumber);
		if (CommonUtility.isValidList(userDetails)) {
			return userDetails.get(0);
		} else {
			throw new UserException(ExceptionResponseCode.USER_DATA_NOT_FOUND);
		}
	}

	@Override
	public String updateUser(UserDetail userDetail) throws UserException {
		UserDetail existingDetails = fetchUser(userDetail.getRegistrationNumber());
		//change updated values
		userRepository.save(userDetail);
		return "User data successfully updated!";
	}

	@Override
	public String deleteUser(String registrationNumber) throws UserException {
		UserDetail userDetail = fetchUser(registrationNumber);
		userDetail.setIsActive(0);
		userRepository.save(userDetail);
		return "User data successfully deleted!";
	}
}