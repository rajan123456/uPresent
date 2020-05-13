package com.upresent.management.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.upresent.management.entity.ModuleData;
import com.upresent.management.exception.ManagementException;
import org.springframework.stereotype.Service;

@Service
public interface AdminModuleService {

	String createModule(ModuleData moduleData) throws ManagementException;

	String updateModule(ModuleData moduleData) throws ManagementException;

	String deleteModule(HttpServletRequest request, String moduleCode) throws ManagementException;

	ModuleData getModule(String moduleCode) throws ManagementException;

	List<ModuleData> getAllModules();
}