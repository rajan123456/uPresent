package com.upresent.management.service;

import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.upresent.management.entity.GeoFenceData;
import com.upresent.management.exception.ExceptionResponseCode;
import com.upresent.management.exception.ManagementException;
import com.upresent.management.producer.KafkaMessageProducer;
import com.upresent.management.producer.RestMessageProducer;
import com.upresent.management.repository.GeoFenceRepository;
import com.upresent.management.requestdto.GeoFenceReq;
import com.upresent.management.responsedto.FetchUserResp;
import com.upresent.management.utils.CommonUtility;
import com.upresent.management.utils.Constant;
import com.upresent.management.utils.UserType;

@Service
public class GeoFenceServiceImpl implements GeoFenceService {

	@Autowired
	private KafkaMessageProducer kafkaMessageProducer;

	@Autowired
	private RestMessageProducer restMessageProducer;

	@Autowired
	private GeoFenceRepository geoFenceRepository;

	@Autowired
	private Environment env;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	ObjectMapper objectMapper;

	Gson gson = new Gson();

	@Override
	public String addGeoFence(GeoFenceReq geoFenceReq) throws ManagementException {
		String username = geoFenceReq.getUsername();
		if (CommonUtility.isValidString(username)) {
			final String baseUrl = env.getProperty("userms.hostname") + ":" + env.getProperty("userms.port")
					+ Constant.FETCH_USER_API_URL + username;
			Map<?, ?> response = restTemplate.getForObject(baseUrl, Map.class);
			final FetchUserResp userInfo = objectMapper.convertValue(response.get("data"), FetchUserResp.class);
			if (userInfo != null) {
				if (userInfo.getUserType().equalsIgnoreCase(UserType.ADMIN.toString())) {
					if (!(CommonUtility.isValidLatitude(geoFenceReq.getLatitude())
							&& CommonUtility.isValidLongitude(geoFenceReq.getLongitude())
							&& geoFenceReq.getRadiusInMeter() > 0)) {
						throw new ManagementException(ExceptionResponseCode.INVALID_REQUEST);
					}
					GeoFenceData geoFenceInfo;
					List<GeoFenceData> existingRecords = geoFenceRepository
							.findByUniversityName(geoFenceReq.getUniversityName());
					if (CommonUtility.isValidList(existingRecords)) {
						geoFenceInfo = existingRecords.get(0);
					} else {
						geoFenceInfo = new GeoFenceData();
					}
					BeanUtils.copyProperties(geoFenceReq, geoFenceInfo);
					geoFenceRepository.save(geoFenceInfo);
					publishGeoUpdates(geoFenceInfo, Constant.GEO_FENCE_CREATED_OR_UPDATED_EVENT);
				} else {
					throw new ManagementException(ExceptionResponseCode.UNAUTHORISED);
				}
			} else {
				throw new ManagementException(ExceptionResponseCode.USER_DATA_NOT_FOUND);
			}
		} else {
			throw new ManagementException(ExceptionResponseCode.INVALID_REQUEST);
		}
		return "Geo details have been successfully saved.";
	}

	@Override
	public GeoFenceData fetchGeoFence(String universityName) throws ManagementException {
		GeoFenceData geoFenceInfo;
		List<GeoFenceData> existingRecords = geoFenceRepository.findByUniversityName(universityName);
		if (CommonUtility.isValidList(existingRecords)) {
			geoFenceInfo = existingRecords.get(0);
		} else {
			throw new ManagementException(ExceptionResponseCode.DATA_NOT_FOUND);
		}
		return geoFenceInfo;
	}

	private void publishGeoUpdates(GeoFenceData geo, String eventType) {
		String message = CommonUtility.stringifyEventForPublish(gson.toJson(geo), eventType,
				Calendar.getInstance().getTime().toString(), "", Constant.MANAGEMENT_SOURCE_ID);
		String useMessagePublisher = env.getProperty("sagaEnabled");
		if (null == useMessagePublisher || 1 == Integer.parseInt(useMessagePublisher)) {
			kafkaMessageProducer.send(message);
		} else {
			restMessageProducer.send(message);
		}
	}

}