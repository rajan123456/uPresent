package com.upresent.reporting.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.upresent.reporting.exception.ExceptionResponseCode;
import com.upresent.reporting.exception.ReportingException;

public class CommonUtility {

	private CommonUtility() {
	}

	public static boolean isNullObject(Object obj) {
		return (null == obj);
	}

	public static Boolean hasMoreElements(Long totalElements, Integer page, Integer size) {
		return (totalElements - (page * size)) > 0;
	}

	public static boolean isValidString(String obj) {
		return (null != obj && !obj.trim().isEmpty());
	}

	public static boolean isValidMap(Map<?, ?> map) {
		return (null != map && map.size() != 0);
	}

	public static boolean isValidCollection(Collection<?> obj) {
		return (obj != null && !obj.isEmpty());
	}

	public static boolean isValidInteger(Integer value) {
		return (value != null && value != 0);
	}

	public static boolean isValidDouble(Double value) {
		return (null != value);
	}

	public static boolean isValidFloat(Float value) {
		return (null != value);
	}

	public static boolean isValidLong(Long value) {
		return (null != value && value.intValue() != 0);
	}

	public static boolean isValidList(List<?> list) {
		return (list != null && !list.isEmpty());
	}

	public static boolean isNotEmpty(String attrKey) {
		return !attrKey.isEmpty();
	}

	public static String stringifyEventForPublish(String param1, String param2, String param3, String param4,
			String param5) {
		StringBuilder builder = new StringBuilder();
		builder.append(param1).append(";").append(param2).append(";").append(param3).append(";").append(param4)
				.append(";").append(param5);
		return builder.toString();
	}

	public static boolean isValidDate(String date) {
		LocalDateTime ldt = null;
		Locale locale = Locale.ENGLISH;
		String format = Constants.DATE_FORMAT;
		DateTimeFormatter fomatter = DateTimeFormatter.ofPattern(format, locale);
		try {
			ldt = LocalDateTime.parse(date, fomatter);
			String result = ldt.format(fomatter);
			return result.equals(date);
		} catch (DateTimeParseException e) {
			try {
				LocalDate ld = LocalDate.parse(date, fomatter);
				String result = ld.format(fomatter);
				return result.equals(date);
			} catch (DateTimeParseException exp) {
				try {
					LocalTime lt = LocalTime.parse(date, fomatter);
					String result = lt.format(fomatter);
					return result.equals(date);
				} catch (DateTimeParseException e2) {
					// Debugging purposes
					// e2.printStackTrace();
				}
			}
		}
		return false;
	}

	public static boolean checkDateInRange(String startDateStr, String endDateStr, String testDateStr) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(Constants.DATE_FORMAT);
			Calendar c = Calendar.getInstance();
			c.setTime(sdf.parse(startDateStr));
			c.add(Calendar.DAY_OF_MONTH, -1);
			startDateStr = sdf.format(c.getTime());
			Date startDate = new SimpleDateFormat(Constants.DATE_FORMAT).parse(startDateStr);
			c.setTime(sdf.parse(endDateStr));
			c.add(Calendar.DAY_OF_MONTH, 1);
			endDateStr = sdf.format(c.getTime());
			Date endDate = new SimpleDateFormat(Constants.DATE_FORMAT).parse(endDateStr);
			Date testDate = new SimpleDateFormat(Constants.DATE_FORMAT).parse(testDateStr);
			return testDate.after(startDate) && testDate.before(endDate);
		} catch (ParseException e) {
			throw new ReportingException(ExceptionResponseCode.DATE_PARSE_ERROR);
		}
	}

	public static boolean isValidStartAndEndDate(String startDateStr, String endDateStr) {
		try {
			Date startDate = new SimpleDateFormat(Constants.DATE_FORMAT).parse(startDateStr);
			Date endDate = new SimpleDateFormat(Constants.DATE_FORMAT).parse(endDateStr);
			long diff = endDate.getTime() - startDate.getTime();
			long days = diff / (1000 * 60 * 60 * 24);
			if(days < 0) {
				throw new ReportingException(ExceptionResponseCode.START_DATE_END_DATE_ERROR);
			}
			return true;
		} catch (ParseException e) {
			throw new ReportingException(ExceptionResponseCode.DATE_PARSE_ERROR);
		}
	}
}