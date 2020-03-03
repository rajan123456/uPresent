package com.upresent.user.service;

import java.util.Calendar;
import java.util.List;

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
		UserDetail user = userRepository.save(userDetail);
		publishUserUpdates(user, Constant.USER_CREATED_EVENT);
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
		publishUserUpdates(existingDetails, Constant.USER_UPDATED_EVENT);
		return "User data successfully updated!";
	}

	@Override
	public String deleteUser(String username) throws UserException {
		UserDetail userDetail = fetchUser(username);
		userDetail.setIsActive(0);
		userRepository.save(userDetail);
		publishUserUpdates(userDetail, Constant.USER_DELETED_EVENT);
		return "User data successfully deleted!";
	}

	private void publishUserUpdates(UserDetail user, String eventType) {
		String message = CommonUtility.stringifyEventForPublish(
				gson.toJson(user),
				eventType,
				Calendar.getInstance().getTime().toString(),
				"",
				Constant.USER_SOURCE_ID
				);
		String useMessagePublisher = env.getProperty("sagaEnabled");
		if (null == useMessagePublisher || 1 == Integer.parseInt(useMessagePublisher)) {
			kafkaMessageProducer.send(message);
		} else {
			restMessageProducer.send(message);
		}
	}
}