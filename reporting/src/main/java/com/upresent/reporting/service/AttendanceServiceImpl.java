package com.upresent.reporting.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.upresent.reporting.entity.ReportingData;
import com.upresent.reporting.exception.ExceptionResponseCode;
import com.upresent.reporting.exception.ReportingException;
import com.upresent.reporting.repository.ReportingRepository;
import com.upresent.reporting.responsedto.StudentAttendanceRecord;
import com.upresent.reporting.utils.CommonUtility;
import com.upresent.reporting.utils.Constants;
import com.upresent.reporting.utils.QueryUtils;

import io.confluent.shaded.com.google.gson.Gson;

@Service
public class AttendanceServiceImpl implements AttendanceService {

	@Autowired
	private Environment env;

	@Autowired
	ReportingRepository reportingRepository;

	@Autowired
	RestTemplate restTemplate;

	@Autowired
	ObjectMapper objectMapper;

	@SuppressWarnings("unchecked")
	@Override
	public Map<String, Object> getStudentAttendanceRecords(String startDate, String endDate, String moduleCode)
			throws ReportingException {
		if (CommonUtility.isValidDate(startDate) && CommonUtility.isValidDate(endDate) && CommonUtility.isValidStartAndEndDate(startDate, endDate)) {
			final String baseUrl = env.getProperty("managementms.hostname") + ":" + env.getProperty("managementms.port")
					+ Constants.FETCH_MODULE_DETAILS_API_URL + moduleCode;
			Map<?, ?> response = restTemplate.getForObject(baseUrl, Map.class);
			Map<String, Object> moduleDetails = objectMapper.convertValue(response.get("data"), Map.class);
			if (moduleDetails != null) {
				String moduleCodeRegexForQuery = QueryUtils.getRegexForModuleCode(moduleCode);
				List<ReportingData> reportingRecords = reportingRepository.findBySourceIdAndEventDataRegex(
						Constants.ATTENDANCE_SERVICE_SOURCE_ID, moduleCodeRegexForQuery);
				Map<String, Object> responseObj = new HashMap<>();
				List<String> dates = new ArrayList<>();
				Map<String, List<StudentAttendanceRecord>> attendanceInfoByDate = new HashMap<>();
				reportingRecords.forEach(record -> {
					try {
						Date date = new SimpleDateFormat(Constants.REPORTING_TIMESTAMP_FORMAT)
								.parse(record.getTimeStamp());
						String attendanceLogDateString = new SimpleDateFormat(Constants.DATE_FORMAT).format(date);
						if (CommonUtility.checkDateInRange(startDate, endDate, attendanceLogDateString)) {
							StudentAttendanceRecord studentAttendance = new StudentAttendanceRecord();
							studentAttendance.setAttendance("PRESENT");
							studentAttendance.setTimestamp(record.getTimeStamp());
							Gson g = new Gson();
							Map<String, Object> eventData = g.fromJson(record.getEventData(), HashMap.class);
							studentAttendance.setStudentUsername((String) eventData.get("username"));
							if (dates.contains(attendanceLogDateString)) {
								List<StudentAttendanceRecord> existingRecords = attendanceInfoByDate
										.get(attendanceLogDateString);
								existingRecords.add(studentAttendance);
								attendanceInfoByDate.put(attendanceLogDateString, existingRecords);
							} else {
								dates.add(attendanceLogDateString);
								List<StudentAttendanceRecord> records = new ArrayList<>();
								records.add(studentAttendance);
								attendanceInfoByDate.put(attendanceLogDateString, records);
							}
						}
					} catch (ParseException e) {
						throw new ReportingException(ExceptionResponseCode.DATE_PARSE_ERROR);
					}
				});
				responseObj.put("dates", dates);
				responseObj.put("attendanceInfo", attendanceInfoByDate);
				return responseObj;
			} else {
				throw new ReportingException(ExceptionResponseCode.MODULE_NOT_FOUND);
			}

		} else {
			throw new ReportingException(ExceptionResponseCode.INVALID_DATE_FORMAT);
		}
	}
}
