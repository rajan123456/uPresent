package com.upresent.management.service;

import java.util.Calendar;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.upresent.management.entity.GeoFenceData;
import com.upresent.management.exception.ExceptionResponseCode;
import com.upresent.management.exception.ManagementException;
import com.upresent.management.producer.KafkaMessageProducer;
import com.upresent.management.producer.RestMessageProducer;
import com.upresent.management.repository.GeoFenceRepository;
import com.upresent.management.requestdto.GeoFenceReq;
import com.upresent.management.utils.CommonUtility;
import com.upresent.management.utils.Constant;
import com.upresent.management.utils.UserModuleUtil;

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

	Gson gson = new Gson();

	@Autowired
	UserModuleUtil userModuleUtil;

	@Override
	public String addGeoFence(GeoFenceReq geoFenceReq) throws ManagementException {
		if (userModuleUtil.isAdmin(geoFenceReq.getUsername())) {
			if (!(CommonUtility.isValidLatitude(geoFenceReq.getLatitude())
					&& CommonUtility.isValidLongitude(geoFenceReq.getLongitude())
					&& geoFenceReq.getRadiusInMeter() > 0)) {
				throw new ManagementException(ExceptionResponseCode.INVALID_REQUEST);
			}
			GeoFenceData geoFenceInfo;
			GeoFenceData existingRecord = geoFenceRepository.findByUniversityName(geoFenceReq.getUniversityName());
			if (existingRecord != null) {
				geoFenceInfo = existingRecord;
			} else {
				geoFenceInfo = new GeoFenceData();
			}
			BeanUtils.copyProperties(geoFenceReq, geoFenceInfo);
			GeoFenceData geoFenceObj = geoFenceRepository.save(geoFenceInfo);
			publishGeoUpdates(geoFenceObj, Constant.GEO_FENCE_CREATED_OR_UPDATED_EVENT);
		} else {
			throw new ManagementException(ExceptionResponseCode.UNAUTHORISED);
		}
		return "Geo details have been successfully saved.";
	}

	@Override
	public GeoFenceData fetchGeoFence(String universityName) throws ManagementException {
		GeoFenceData geoFenceInfo;
		GeoFenceData existingRecord = geoFenceRepository.findByUniversityName(universityName);
		if (existingRecord != null) {
			geoFenceInfo = existingRecord;
		} else {
			throw new ManagementException(ExceptionResponseCode.DATA_NOT_FOUND);
		}
		return geoFenceInfo;
	}

	@Override
	public Iterable<GeoFenceData> fetchAllGeoFences() {
		return geoFenceRepository.findAll();
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