package com.upresent.reporting.service;

import com.upresent.reporting.entity.ReportingData;
import com.upresent.reporting.exception.ReportingException;

public interface ReportingService {

	String addReportingData(ReportingData reportingData) throws ReportingException;
}