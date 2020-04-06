package com.upresent.reporting.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.upresent.reporting.entity.ReportingData;
import com.upresent.reporting.service.ReportingService;
import com.upresent.reporting.utils.RestResponse;
import com.upresent.reporting.utils.RestUtils;

@RestController
@RequestMapping("/reporting")
public class ReportingController {

	@Autowired
	ReportingService reportingService;

	@PostMapping
	public ResponseEntity<RestResponse<String>> getAttendanceReport(@RequestBody ReportingData reportingData) {
		return RestUtils.successResponse(reportingService.addReportingData(reportingData));
	}
}
