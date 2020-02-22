package com.upresent.metrics.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.upresent.metrics.entity.MetricsData;
import com.upresent.metrics.exception.MetricsException;
import com.upresent.metrics.repository.MetricsRepository;

public class MetricsServiceImpl implements MetricsService {

	@Autowired
	private MetricsRepository metricsRepository;

	@Override
	public String addMetricsData(MetricsData metricsData) throws MetricsException {
		metricsRepository.save(metricsData);
		return "Added successfully!";
	}

}