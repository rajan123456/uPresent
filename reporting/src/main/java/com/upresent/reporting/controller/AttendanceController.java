package com.upresent.reporting.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.upresent.reporting.service.AttendanceService;
import com.upresent.reporting.utils.RestResponse;
import com.upresent.reporting.utils.RestUtils;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

	@Autowired
	AttendanceService attendanceService;

	@GetMapping
	public ResponseEntity<RestResponse<Map<String, Object>>> addMetricsData(@RequestParam String startDate,
			@RequestParam String endDate, @RequestParam String moduleCode) {
		return RestUtils.successResponse(attendanceService.getStudentAttendanceRecords(startDate, endDate, moduleCode));
	}
}
