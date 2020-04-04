package com.upresent.user.service;

import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.upresent.user.entity.UserDetail;
import com.upresent.user.exception.ExceptionResponseCode;
import com.upresent.user.exception.UserException;
import com.upresent.user.producer.KafkaMessageProducer;
import com.upresent.user.producer.RestMessageProducer;
import com.upresent.user.repository.UserRepository;
import com.upresent.user.utils.CommonUtility;
import com.upresent.user.utils.Constant;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private KafkaMessageProducer kafkaMessageProducer;

	Gson gson = new Gson();

	@Autowired
	private RestMessageProducer restMessageProducer;

	@Autowired
	private Environment env;

	@Override
	public String registerUser(UserDetail userDetail) throws UserException {
		userDetail.setUsername(userDetail.getUsername().toLowerCase());
		String username = userDetail.getUsername();
		UserDetail user = userRepository.findByUsernameAndIsActive(username, Constant.ACTIVE_STATUS);
		if (user != null) {
			throw new UserException(ExceptionResponseCode.USERNAME_ALREADY_TAKEN);
		}
		user = userRepository.save(userDetail);
		publishUserUpdates(user, Constant.USER_CREATED_EVENT);
		return "User registered successfully!";
	}

	@Override
	public UserDetail fetchUser(String username) throws UserException {
		UserDetail userDetails = userRepository.findByUsernameAndIsActive(username.toLowerCase(), Constant.ACTIVE_STATUS);
		if (userDetails != null) {
			return userDetails;
		} else {
			throw new UserException(ExceptionResponseCode.USER_DATA_NOT_FOUND);
		}
	}

	@Override
	public Iterable<UserDetail> fetchAllUsers() throws UserException {
		return userRepository.findAll();
	}

	@Override
	public String updateUser(UserDetail userDetail) throws UserException {
		UserDetail existingDetails = fetchUser(userDetail.getUsername());
		existingDetails.setName(
				CommonUtility.isValidString(userDetail.getName()) ? userDetail.getName() : existingDetails.getName());
		existingDetails.setPassword(CommonUtility.isValidString(userDetail.getPassword()) ? userDetail.getPassword()
				: existingDetails.getPassword());
		userRepository.save(existingDetails);
		publishUserUpdates(existingDetails, Constant.USER_UPDATED_EVENT);
		return "User data successfully updated!";
	}

	@Override
	public String deleteUser(String username) throws UserException {
		UserDetail userDetail = fetchUser(username);
		userDetail.setIsActive(Constant.INACTIVE_STATUS);
		userRepository.save(userDetail);
		publishUserUpdates(userDetail, Constant.USER_DELETED_EVENT);
		return "User data successfully deleted!";
	}

	private void publishUserUpdates(UserDetail user, String eventType) {
		String message = CommonUtility.stringifyEventForPublish(gson.toJson(user), eventType,
				Calendar.getInstance().getTime().toString(), "", Constant.USER_SOURCE_ID);
		String useMessagePublisher = env.getProperty("sagaEnabled");
		if (null == useMessagePublisher || 1 == Integer.parseInt(useMessagePublisher)) {
			kafkaMessageProducer.send(message);
		} else {
			restMessageProducer.send(message);
		}
	}

	@Override
	public Map<String, Object> getUserType(List<String> usernames) {
		ListIterator<String> iterator = usernames.listIterator();
		while (iterator.hasNext()) {
			iterator.set(iterator.next().toLowerCase());
		}
		Map<String, Object> resultMap = new HashMap<>();
		List<UserDetail> users = userRepository.findByUsernameIn(usernames);
		Set<String> admins = new HashSet<>();
		Set<String> students = new HashSet<>();
		Set<String> unknown = new HashSet<>();
		for (UserDetail user : users) {
			String userType = user.getUserType();
			usernames.removeIf(x -> x.equals(user.getUsername()));
			if ("student".equalsIgnoreCase(userType)) {
				students.add(user.getUsername());
			} else if ("admin".equalsIgnoreCase(userType)) {
				admins.add(user.getUsername());
			} else {
				unknown.add(user.getUsername());
			}
		}
		for (String username : usernames) {
			unknown.add(username);
		}
		resultMap.put("admin", admins);
		resultMap.put("student", students);
		resultMap.put("unknown", unknown);
		return resultMap;
	}
}