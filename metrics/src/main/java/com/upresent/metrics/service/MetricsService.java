package com.upresent.metrics.service;

import com.upresent.metrics.entity.MetricsData;
import com.upresent.metrics.exception.MetricsException;

public interface MetricsService {

	String addMetricsData(MetricsData metricsData) throws MetricsException;

}