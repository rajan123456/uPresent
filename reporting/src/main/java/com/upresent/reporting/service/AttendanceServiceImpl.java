package com.upresent.reporting.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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
	public Map<String, Object> getStudentAttendanceRecords(String filterStartDateStr, String filterEndDateStr,
			String moduleId) throws ReportingException {
		if (CommonUtility.isValidDate(filterStartDateStr) && CommonUtility.isValidDate(filterEndDateStr)
				&& CommonUtility.isValidStartAndEndDate(filterStartDateStr, filterEndDateStr)) {
			final String baseUrl = env.getProperty("managementms.hostname") + ":" + env.getProperty("managementms.port")
					+ Constants.FETCH_MODULE_DETAILS_API_URL + moduleId;
			Map<?, ?> response = restTemplate.getForObject(baseUrl, Map.class);
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
						if (CommonUtility.checkDateInRange(filterStartDateStr, filterEndDateStr,
								attendanceLogDateStr)) {
							StudentAttendanceRecord studentAttendance = new StudentAttendanceRecord();
							studentAttendance.setAttendance("PRESENT");
							studentAttendance.setTimestamp(record.getTimeStamp());
							Gson g = new Gson();
							Map<String, Object> eventData = g.fromJson(record.getEventData(), HashMap.class);
							studentAttendance.setStudentUsername((String) eventData.get("username"));
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
				List<String> allEnrolledStudentUsernames = (List<String>) moduleDetails.get("studentUsernames");
				dates.forEach(date -> {
					List<StudentAttendanceRecord> attendanceInfo = attendanceInfoByDate.get(date);
					List<String> presentStudentUsernames = new ArrayList<>();
					attendanceInfo.forEach(studentAttendance -> {
						presentStudentUsernames.add(studentAttendance.getStudentUsername());
					});
					List<String> absentStudentUsernames = allEnrolledStudentUsernames.stream()
							.filter(e -> !presentStudentUsernames.contains(e)).collect(Collectors.toList());
					List<StudentAttendanceRecord> existingRecords = attendanceInfoByDate.get(date);
					absentStudentUsernames.forEach(absentStudent -> {
						StudentAttendanceRecord absentyRecord = new StudentAttendanceRecord();
						absentyRecord.setAttendance("ABSENT");
						absentyRecord.setStudentUsername(absentStudent);
						absentyRecord.setTimestamp("");
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
					allStudentsAbsentRecords.add(absentyRecord);
				});
				List<String> commonDates = getIntersectingDates(filterStartDateStr, filterEndDateStr,
						(String) moduleDetails.get("startDate"), (String) moduleDetails.get("endDate"));
				commonDates.forEach(date -> {
					attendanceInfoByDate.computeIfAbsent(date, k -> allStudentsAbsentRecords);
				});
				responseObj.put("dates", commonDates);
				responseObj.put("attendanceInfo", attendanceInfoByDate);
				return responseObj;
			} else {
				throw new ReportingException(ExceptionResponseCode.MODULE_NOT_FOUND);
			}
		} else {
			throw new ReportingException(ExceptionResponseCode.INVALID_DATE_FORMAT);
		}
	}

	private List<String> getIntersectingDates(String filterStartDateStr, String filterEndDateStr,
			String moduleStartDateStr, String moduleEndDateStr) {
		List<String> intersectingDatesStr = new ArrayList<>();
		try {
			Date filterStartDate = new SimpleDateFormat(Constants.DATE_FORMAT).parse(filterStartDateStr);
			Date filterEndDate = new SimpleDateFormat(Constants.DATE_FORMAT).parse(filterEndDateStr);
			Date moduleStartDate = new SimpleDateFormat(Constants.DATE_FORMAT).parse(moduleStartDateStr);
			Date moduleEndDate = new SimpleDateFormat(Constants.DATE_FORMAT).parse(moduleEndDateStr);
			// check if the two date ranges overlap
			if ((filterStartDate.compareTo(moduleEndDate) == 0 || filterStartDate.compareTo(moduleEndDate) < 0)
					&& (moduleStartDate.compareTo(filterEndDate) == 0
							|| moduleStartDate.compareTo(filterEndDate) < 0)) {
				String intersectionStartDateStr = filterStartDate.compareTo(moduleStartDate) < 0 ? moduleStartDateStr
						: filterStartDateStr;
				String intersectionEndDateStr = filterEndDate.compareTo(moduleEndDate) < 0 ? filterEndDateStr
						: moduleEndDateStr;
				DateTimeFormatter dtf = DateTimeFormatter.ofPattern(Constants.DATE_FORMAT);
				LocalDate start = LocalDate.parse(intersectionStartDateStr, dtf);
				LocalDate end = LocalDate.parse(intersectionEndDateStr, dtf);
				long numOfDaysBetween = ChronoUnit.DAYS.between(start, end);
				List<LocalDate> intersectingDates = IntStream.iterate(0, i -> i + 1).limit(numOfDaysBetween)
						.mapToObj(i -> start.plusDays(i)).collect(Collectors.toList());
				if (!intersectingDates.contains(start)) {
					intersectingDates.add(start);
				}
				if (!intersectingDates.contains(end)) {
					intersectingDates.add(end);
				}
				intersectingDates.forEach(date -> {
					intersectingDatesStr.add(date.format(DateTimeFormatter.ofPattern(Constants.DATE_FORMAT)));
				});
			}
		} catch (ParseException e) {
			throw new ReportingException(ExceptionResponseCode.DATE_PARSE_ERROR);
		}
		return intersectingDatesStr;
	}
}
