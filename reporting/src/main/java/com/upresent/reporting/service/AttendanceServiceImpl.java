package com.upresent.reporting.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.upresent.reporting.responsedto.ScheduleRecord;
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
	ReportingRepository reportingRepository;

	@Autowired
	RestTemplate restTemplate;

	@Autowired
	ObjectMapper objectMapper;

	@Autowired
	Environment env;

	@SuppressWarnings("unchecked")
	@Override
	public Map<String, Object> getStudentAttendanceRecords(String filterStartDateStr, String filterEndDateStr,
			String moduleId) throws ReportingException {
		if (CommonUtility.isValidDate(filterStartDateStr) && CommonUtility.isValidDate(filterEndDateStr)
				&& CommonUtility.isValidStartAndEndDate(filterStartDateStr, filterEndDateStr)) {
			String managementMSHostName = System.getenv(Constants.MANAGEMENT_MS_HOSTNAME_ENV_VARIABLE) == null
					? env.getProperty(Constants.MANAGEMENT_MS_HOSTNAME_ENV_VARIABLE)
					: System.getenv(Constants.MANAGEMENT_MS_HOSTNAME_ENV_VARIABLE);
			String managementMSPort = System.getenv(Constants.MANAGEMENT_MS_PORT_ENV_VARIABLE) == null
					? env.getProperty(Constants.MANAGEMENT_MS_PORT_ENV_VARIABLE)
					: System.getenv(Constants.MANAGEMENT_MS_PORT_ENV_VARIABLE);
			final String baseUrl = managementMSHostName + ":" + managementMSPort
					+ Constants.FETCH_MODULE_DETAILS_API_URL + moduleId;
			Map<?, ?> response = restTemplate.getForObject(baseUrl, Map.class);
			if (response == null)
				throw new ReportingException(ExceptionResponseCode.MODULE_NOT_FOUND);
			Map<String, Object> moduleDetails = objectMapper.convertValue(response.get("data"), Map.class);
			if (moduleDetails != null) {
				String moduleIdRegexForQuery = QueryUtils.getRegexForModuleId(moduleId);
				List<ReportingData> reportingRecords = reportingRepository
						.findBySourceIdAndEventDataRegex(Constants.ATTENDANCE_SERVICE_SOURCE_ID, moduleIdRegexForQuery);
				Map<String, Object> responseObj = new HashMap<>();
				List<String> dates = new ArrayList<>();
				Map<String, List<StudentAttendanceRecord>> attendanceInfoByDate = new HashMap<>();
				reportingRecords.forEach(record -> {
					try {
						Date date = new SimpleDateFormat(Constants.REPORTING_TIMESTAMP_FORMAT)
								.parse(record.getTimeStamp());
						String attendanceLogDateStr = new SimpleDateFormat(Constants.DATE_FORMAT).format(date);
						if (CommonUtility.checkDateInRange(filterStartDateStr, filterEndDateStr, attendanceLogDateStr)
								&& (record.getEventType().equals(Constants.ATTENDANCE_RECORDED_EVENT_TYPE))) {
							StudentAttendanceRecord studentAttendance = new StudentAttendanceRecord();
							studentAttendance.setAttendance("PRESENT");
							studentAttendance.setAdminUsername("");
							studentAttendance.setTimestamp(record.getTimeStamp());
							Gson g = new Gson();
							Map<String, Object> eventData = g.fromJson(record.getEventData(), HashMap.class);
							studentAttendance.setStudentUsername((String) eventData.get("username"));
							studentAttendance.setRecognitionSource((String) eventData.get("recognitionSource"));
							studentAttendance.setRecognitionConfidence((String) eventData.get("recognitionConfidence"));
							studentAttendance.setCapturedImageId((String) eventData.get("capturedImageId"));
							if (dates.contains(attendanceLogDateStr)) {
								List<StudentAttendanceRecord> existingRecords = attendanceInfoByDate
										.get(attendanceLogDateStr);
								existingRecords.add(studentAttendance);
								attendanceInfoByDate.put(attendanceLogDateStr, existingRecords);
							} else {
								dates.add(attendanceLogDateStr);
								List<StudentAttendanceRecord> records = new ArrayList<>();
								records.add(studentAttendance);
								attendanceInfoByDate.put(attendanceLogDateStr, records);
							}
						}
					} catch (ParseException e) {
						throw new ReportingException(ExceptionResponseCode.DATE_PARSE_ERROR);
					}
				});
				reportingRecords.forEach(record -> {
					try {
						Date date = new SimpleDateFormat(Constants.REPORTING_TIMESTAMP_FORMAT)
								.parse(record.getTimeStamp());
						String attendanceLogDateStr = new SimpleDateFormat(Constants.DATE_FORMAT).format(date);
						if (CommonUtility.checkDateInRange(filterStartDateStr, filterEndDateStr, attendanceLogDateStr)
								&& (record.getEventType().equals(Constants.ATTENDANCE_REVOKED_EVENT_TYPE))) {
							StudentAttendanceRecord studentAttendance = new StudentAttendanceRecord();
							studentAttendance.setAttendance("REVOKED");
							studentAttendance.setRecognitionSource("");
							studentAttendance.setRecognitionConfidence("");
							studentAttendance.setCapturedImageId("");
							studentAttendance.setTimestamp(record.getTimeStamp());
							Gson g = new Gson();
							Map<String, Object> eventData = g.fromJson(record.getEventData(), HashMap.class);
							studentAttendance.setStudentUsername((String) eventData.get("username"));
							studentAttendance.setAdminUsername((String) eventData.get("revokedBy"));
							List<StudentAttendanceRecord> existingRecords = attendanceInfoByDate
									.get(attendanceLogDateStr);
							Optional<StudentAttendanceRecord> toRemove = existingRecords.stream()
									.filter(o -> o.getStudentUsername().equals(eventData.get("username"))).findFirst();
							if (toRemove.isPresent()) {
								existingRecords.remove(toRemove.get());
							}
							existingRecords.add(studentAttendance);
							attendanceInfoByDate.put(attendanceLogDateStr, existingRecords);
						}
					} catch (ParseException e) {
						throw new ReportingException(ExceptionResponseCode.DATE_PARSE_ERROR);
					}
				});
				List<String> allEnrolledStudentUsernames = (List<String>) moduleDetails.get("studentUsernames");
				dates.forEach(date -> {
					List<StudentAttendanceRecord> attendanceInfo = attendanceInfoByDate.get(date);
					List<String> recordedStudentUsernames = new ArrayList<>();
					attendanceInfo.forEach(studentAttendance -> {
						recordedStudentUsernames.add(studentAttendance.getStudentUsername());
					});
					List<String> absentStudentUsernames = allEnrolledStudentUsernames.stream()
							.filter(e -> !recordedStudentUsernames.contains(e)).collect(Collectors.toList());
					List<StudentAttendanceRecord> existingRecords = attendanceInfoByDate.get(date);
					absentStudentUsernames.forEach(absentStudent -> {
						StudentAttendanceRecord absentyRecord = new StudentAttendanceRecord();
						absentyRecord.setAttendance("ABSENT");
						absentyRecord.setStudentUsername(absentStudent);
						absentyRecord.setTimestamp("");
						absentyRecord.setRecognitionSource("");
						absentyRecord.setRecognitionConfidence("");
						absentyRecord.setCapturedImageId("");
						absentyRecord.setAdminUsername("");
						existingRecords.add(absentyRecord);
					});
					attendanceInfoByDate.put(date, existingRecords);
				});
				List<StudentAttendanceRecord> allStudentsAbsentRecords = new ArrayList<>();
				allEnrolledStudentUsernames.forEach(absentStudent -> {
					StudentAttendanceRecord absentyRecord = new StudentAttendanceRecord();
					absentyRecord.setAttendance("ABSENT");
					absentyRecord.setStudentUsername(absentStudent);
					absentyRecord.setTimestamp("");
					absentyRecord.setRecognitionSource("");
					absentyRecord.setRecognitionConfidence("");
					absentyRecord.setCapturedImageId("");
					absentyRecord.setAdminUsername("");
					allStudentsAbsentRecords.add(absentyRecord);
				});
				ScheduleRecord[] scheduleRecords;
				try {
					scheduleRecords = objectMapper.readValue(
							objectMapper.writeValueAsString(moduleDetails.get("schedule")), ScheduleRecord[].class);
				} catch (JsonProcessingException e) {
					throw new ReportingException(ExceptionResponseCode.DATE_PARSE_ERROR);
				}
				List<String> moduleDates = Arrays.stream(scheduleRecords).map(e -> e.getDate())
						.collect(Collectors.toList());
				List<String> filteredModuleDates = filterModuleDatesWithReportDates(moduleDates, filterStartDateStr,
						filterEndDateStr);
				filteredModuleDates.forEach(date -> {
					attendanceInfoByDate.computeIfAbsent(date, k -> allStudentsAbsentRecords);
				});
				responseObj.put("dates", filteredModuleDates);
				responseObj.put("attendanceInfo", attendanceInfoByDate);
				return responseObj;
			} else {
				throw new ReportingException(ExceptionResponseCode.MODULE_NOT_FOUND);
			}
		} else {
			throw new ReportingException(ExceptionResponseCode.INVALID_DATE_FORMAT);
		}
	}

	private List<String> filterModuleDatesWithReportDates(List<String> moduleDates, String filterStartDateStr,
			String filterEndDateStr) {
		List<String> filteredDates = new ArrayList<>();
		try {
			Date filterStartDate = new SimpleDateFormat(Constants.DATE_FORMAT).parse(filterStartDateStr);
			Date filterEndDate = new SimpleDateFormat(Constants.DATE_FORMAT).parse(filterEndDateStr);
			moduleDates.forEach(moduleDateStr -> {
				try {
					Date moduleDate = new SimpleDateFormat(Constants.DATE_FORMAT).parse(moduleDateStr);
					if ((moduleDate.after(filterStartDate) && moduleDate.before(filterEndDate))
							|| moduleDate.equals(filterStartDate) || moduleDate.equals(filterEndDate))
						filteredDates.add(moduleDateStr);
				} catch (ParseException e) {
					throw new ReportingException(ExceptionResponseCode.DATE_PARSE_ERROR);
				}
			});
			return filteredDates;
		} catch (ParseException e) {
			throw new ReportingException(ExceptionResponseCode.DATE_PARSE_ERROR);
		}
	}

}
