package com.upresent.management.utils;

import java.util.*;

public class CommonUtility {

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
		return (obj != null && obj.size() > 0);
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
		return (list != null && list.size() != 0);
	}

	public static boolean isNotEmpty(String attrKey) {
		return !attrKey.isEmpty();
	}
	
	public static boolean isValidLatitude(Float latitude) {
		return (latitude >= -90 && latitude <= 90);
	}
	
	public static boolean isValidLongitude(Float longitude) {
		return (longitude >= -180 && longitude <= 180);
	}

	public static boolean isValidTimeZone(String timezone) {
		String[] validIDs = TimeZone.getAvailableIDs();
		for (String str : validIDs) {
			if (str != null && str.equals(timezone)) {
				return true;
			}
		}
		return false;
	}
	
	public static String stringifyEventForPublish(String param1, String param2, String param3, String param4, String param5) {
		StringBuilder builder = new StringBuilder();
		builder.append(param1).append(";").append(param2).append(";").append(param3).append(";").append(param4).append(";").append(param5);
        return builder.toString();
    }
}