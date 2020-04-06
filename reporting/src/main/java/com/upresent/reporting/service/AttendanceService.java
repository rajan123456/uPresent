package com.upresent.reporting.service;

import java.util.Map;

import com.upresent.reporting.exception.ReportingException;

public interface AttendanceService {

	Map<String, Object> getStudentAttendanceRecords(String startDate, String endDate, String moduleCode) throws ReportingException;
}