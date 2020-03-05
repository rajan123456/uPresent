package com.upresent.reporting.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.upresent.reporting.entity.ReportingData;
import com.upresent.reporting.exception.ReportingException;
import com.upresent.reporting.repository.ReportingRepository;


public class ReportingServiceImpl implements ReportingService {
	@Autowired
	private ReportingRepository reportingRepository;

	@Override
	public String addReportingData(ReportingData reportingData) throws ReportingException {
		reportingRepository.save(reportingData);
		return "Added successfully!";
	}
}
