package com.upresent.management.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.upresent.management.entity.ModuleData;
import com.upresent.management.exception.ManagementException;
import com.upresent.management.repository.ModuleRepository;

@Service
public class StudentModuleServiceImpl implements StudentModuleService {

	@Autowired
	private ModuleRepository moduleRepository;

	@Override
	public List<String> getEnrolledModules(String username) throws ManagementException {
		List<ModuleData> allModules = moduleRepository.findAll();
		List<String> moduleCodes = new ArrayList<>();
		for(ModuleData module: allModules) {
			if(module.getStudentUsernames().contains(username)) {
				moduleCodes.add(module.getModuleCode());
			}
		}
		return moduleCodes;
	}
	
}