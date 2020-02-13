package com.upresent.management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.upresent.management.entity.UserDetail;
import com.upresent.management.service.ManagementService;
import com.upresent.management.utils.RestResponse;
import com.upresent.management.utils.RestUtils;

@RestController
@RequestMapping("/management")
public class ManagementController {


	@Autowired
	private ManagementService managementService;

	@PostMapping
	public ResponseEntity<RestResponse<String>> addUser(
			@RequestBody UserDetail userDetail) {
		return RestUtils.successResponse(managementService.addUser(userDetail));
	}

	@GetMapping
	public ResponseEntity<RestResponse<List<UserDetail>>> fetchUsers(
			@RequestParam(required = false) String username,
			@RequestParam(required = false) String name,
			@RequestParam(required = false) String userType) {
		return RestUtils.successResponse(managementService.fetchUsers(username, name, userType));
	}

	@PutMapping
	public ResponseEntity<RestResponse<String>> updateUser(
			@RequestBody UserDetail userDetail) {
		return RestUtils.successResponse(managementService.updateUser(userDetail));
	}
	
	@DeleteMapping
	public ResponseEntity<RestResponse<String>> deleteUser(String username) {
		return RestUtils.successResponse(managementService.deleteUser(username));
	}

}