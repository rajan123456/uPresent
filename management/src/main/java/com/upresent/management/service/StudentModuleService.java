package com.upresent.management.service;

import java.util.List;

import com.upresent.management.exception.ManagementException;

public interface StudentModuleService {

	public List<String> getEnrolledModules(String username) throws ManagementException;
}