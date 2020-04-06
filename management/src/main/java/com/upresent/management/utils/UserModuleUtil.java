package com.upresent.management.utils;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.upresent.management.exception.ExceptionResponseCode;
import com.upresent.management.exception.ManagementException;
import com.upresent.management.responsedto.FetchUserResp;

@Component
@SuppressWarnings("unchecked")
public class UserModuleUtil {
	
	@Autowired
	private Environment env;

	@Autowired
	RestTemplate restTemplate;

	@Autowired
	ObjectMapper objectMapper;
	
	public boolean isStudent(String username) {
		return "student".equalsIgnoreCase(getUserTypeFromUsername(username));
	}
	
	public boolean isAdmin(String username) {
		return "admin".equalsIgnoreCase(getUserTypeFromUsername(username));
	}
	
	private String getUserTypeFromUsername(String username) {
		if (CommonUtility.isValidString(username)) {
			final String baseUrl = env.getProperty("userms.hostname") + ":" + env.getProperty("userms.port")
					+ Constant.FETCH_USER_API_URL + username;
			Map<?, ?> response = restTemplate.getForObject(baseUrl, Map.class);
			final FetchUserResp userInfo = objectMapper.convertValue(response.get("data"), FetchUserResp.class);
			if (userInfo != null) {
				return userInfo.getUserType();
			} else {
				throw new ManagementException(ExceptionResponseCode.USER_DATA_NOT_FOUND);
			}
		} else {
			throw new ManagementException(ExceptionResponseCode.INVALID_REQUEST);
		}
	}
	
	public Map<String, Object> getUserTypesFromUsernames(List<String> usernames) {
		if (CommonUtility.isValidList(usernames)) {
			final String baseUrl = env.getProperty("userms.hostname") + ":" + env.getProperty("userms.port")
					+ Constant.FETCH_USER_TYPES_API_URL;
			Map<?, ?> response = restTemplate.postForObject(baseUrl, usernames, Map.class);
			final Map<String, Object> userInfo = (Map<String, Object>) response.get("data");
			if (userInfo != null) {
				return userInfo;
			} else {
				throw new ManagementException(ExceptionResponseCode.USER_TYPES_NOT_FOUND);
			}
		} else {
			throw new ManagementException(ExceptionResponseCode.INVALID_REQUEST);
		}
	}

}
