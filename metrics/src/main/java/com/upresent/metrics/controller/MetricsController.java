package com.upresent.metrics.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.upresent.metrics.entity.MetricsData;
import com.upresent.metrics.service.MetricsService;
import com.upresent.metrics.utils.RestResponse;
import com.upresent.metrics.utils.RestUtils;

@RestController
@RequestMapping("/metrics")
public class MetricsController {

	@Autowired
	private MetricsService metricsService;

	@PostMapping
	public ResponseEntity<RestResponse<String>> addMetricsData(
			@RequestBody MetricsData metricsData) {
		return RestUtils.successResponse(metricsService.addMetricsData(metricsData));
	}
}