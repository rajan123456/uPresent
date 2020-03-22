package com.upresent.management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.upresent.management.service.StudentModuleService;
import com.upresent.management.utils.RestResponse;
import com.upresent.management.utils.RestUtils;

@RestController
@RequestMapping("/student-module")
public class StudentModuleController {

	@Autowired
	private StudentModuleService studentModuleService;

	@GetMapping
	public ResponseEntity<RestResponse<List<String>>> get(
			@RequestParam String username) {
		return RestUtils.successResponse(studentModuleService.getEnrolledModules(username));
	}

}