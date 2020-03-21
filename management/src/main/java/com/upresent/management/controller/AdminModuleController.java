package com.upresent.management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.upresent.management.entity.ModuleData;
import com.upresent.management.service.AdminModuleService;
import com.upresent.management.utils.RestResponse;
import com.upresent.management.utils.RestUtils;

@RestController
@RequestMapping("/manage/module")
public class AdminModuleController {

	@Autowired
	private AdminModuleService adminModuleService;

	@PostMapping
	public ResponseEntity<RestResponse<String>> createModule(
			@RequestBody ModuleData moduleInfo) {
		return RestUtils.successResponse(adminModuleService.createModule(moduleInfo));
	}
	
	@PutMapping
	public ResponseEntity<RestResponse<String>> updateModule(
			@RequestBody ModuleData moduleInfo) {
		return RestUtils.successResponse(adminModuleService.updateModule(moduleInfo));
	}

}