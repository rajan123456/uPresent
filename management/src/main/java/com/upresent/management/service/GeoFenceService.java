package com.upresent.management.service;

import com.upresent.management.entity.GeoFenceData;
import com.upresent.management.exception.ManagementException;
import com.upresent.management.requestdto.GeoFenceReq;

public interface GeoFenceService {

	String addGeoFence(GeoFenceReq geoFence) throws ManagementException;
	
	GeoFenceData fetchGeoFence(String universityName) throws ManagementException;
}