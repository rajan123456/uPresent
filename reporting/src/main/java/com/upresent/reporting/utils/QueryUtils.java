package com.upresent.reporting.utils;

public class QueryUtils {
	
	// for querying eventData field (by moduleId) of 'reporting' document
	public static String getRegexForModuleCode(String moduleCode) {
		return ".*\"moduleId\": \"" + moduleCode + "\".*";
	}
}
