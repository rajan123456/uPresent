package com.upresent.management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.upresent.management.entity.GeoFenceData;
import com.upresent.management.requestdto.GeoFenceReq;
import com.upresent.management.service.GeoFenceService;
import com.upresent.management.utils.RestResponse;
import com.upresent.management.utils.RestUtils;

@RestController
@RequestMapping("/manage/geo-fence")
public class GeoFenceController {

	@Autowired
	private GeoFenceService geoFenceService;

//	[7:26 PM, 3/10/2020] NUS Rajan: then create an event and push it to kafka / call 
//	metrics and reporting api directly based on flag in config for kafkaEnabled=true/false
	
	@PostMapping
	public ResponseEntity<RestResponse<String>> addGeoFence(
			@RequestBody GeoFenceReq geoFenceReq) {
		return RestUtils.successResponse(geoFenceService.addGeoFence(geoFenceReq));
	}
	
	@GetMapping
	public ResponseEntity<RestResponse<GeoFenceData>> fetchGeoFence(@RequestParam("universityName") String universityName) {
		return RestUtils.successResponse(geoFenceService.fetchGeoFence(universityName));
	}

}