package com.upresent.management.service;

import com.upresent.management.entity.ModuleData;
import com.upresent.management.exception.ManagementException;

public interface AdminModuleService {

	String createModule(ModuleData moduleData) throws ManagementException;
	String updateModule(ModuleData moduleData) throws ManagementException;
}