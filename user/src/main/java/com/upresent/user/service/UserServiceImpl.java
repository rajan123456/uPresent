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
	public UserDetail fetchUser(String username) throws UserException {
		List<UserDetail> userDetails = userRepository.findByUsername(username);
		if (CommonUtility.isValidList(userDetails)) {
			return userDetails.get(0);
		} else {
			throw new UserException(ExceptionResponseCode.USER_DATA_NOT_FOUND);
		}
	}

	@Override
	public String updateUser(UserDetail userDetail) throws UserException {
		UserDetail existingDetails = fetchUser(userDetail.getUsername());
		existingDetails.setName(CommonUtility.isValidString(userDetail.getName())?
				userDetail.getName() : existingDetails.getName());
		existingDetails.setPassword(CommonUtility.isValidString(userDetail.getPassword())?
				userDetail.getPassword() : existingDetails.getPassword());
		userRepository.save(existingDetails);
		return "User data successfully updated!";
	}

	@Override
	public String deleteUser(String username) throws UserException {
		UserDetail userDetail = fetchUser(username);
		userDetail.setIsActive(0);
		userRepository.save(userDetail);
		return "User data successfully deleted!";
	}
}