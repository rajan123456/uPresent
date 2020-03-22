package com.upresent.management.service;

import java.util.List;

import com.upresent.management.entity.ModuleData;
import com.upresent.management.exception.ManagementException;

public interface AdminModuleService {

	String createModule(ModuleData moduleData) throws ManagementException;

	String updateModule(ModuleData moduleData) throws ManagementException;

	String deleteModule(String moduleCode) throws ManagementException;

	ModuleData getModule(String moduleCode) throws ManagementException;

	List<ModuleData> getAllModules() throws ManagementException;
}