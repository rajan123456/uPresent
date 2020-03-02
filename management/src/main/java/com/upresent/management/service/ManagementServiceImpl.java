package com.upresent.management.service;

import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

import com.google.gson.Gson;
import com.upresent.management.entity.UserDetail;
import com.upresent.management.exception.ManagementException;
import com.upresent.management.producer.KafkaMessageProducer;
import com.upresent.management.producer.RestMessageProducer;
import com.upresent.management.repository.UserRepository;
import com.upresent.management.utils.CommonUtility;
import com.upresent.management.utils.Constant;

public class ManagementServiceImpl implements ManagementService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private KafkaMessageProducer kafkaMessageProducer;

	@Autowired
	private RestMessageProducer restMessageProducer;

	@Autowired
	private Environment env;

	Gson gson = new Gson();

	@Override
	public String addUser(UserDetail userDetail) throws ManagementException {
		userRepository.save(userDetail);
		publishManagementUpdates(userDetail, Constant.USER_CREATED_EVENT);
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
		publishManagementUpdates(existingDetails, Constant.USER_UPDATED_EVENT);
		return "User data successfully updated!";
	}

	@Override
	public String deleteUser(String username) throws ManagementException {
		UserDetail userDetail = fetchUsers(null, null, username).get(0);
		userDetail.setIsActive(0);
		publishManagementUpdates(userDetail, Constant.USER_DELETED_EVENT);
		userRepository.save(userDetail);
		return "User data successfully deleted!";
	}

	private void publishManagementUpdates(UserDetail user, String eventType) {
		String message = CommonUtility.stringifyEventForPublish(
				gson.toJson(user),
				eventType,
				Calendar.getInstance().getTime().toString(),
				"",
				Constant.MANAGEMENT_SOURCE_ID
				);
		String useMessagePublisher = env.getProperty("sagaEnabled");
		if (null == useMessagePublisher || 1 == Integer.parseInt(useMessagePublisher)) {
			kafkaMessageProducer.send(message);
		} else {
			restMessageProducer.send(message);
		}
	}

}