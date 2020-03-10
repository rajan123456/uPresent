package com.upresent.user.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.upresent.user.entity.UserDetail;
import com.upresent.user.service.UserService;
import com.upresent.user.utils.RestResponse;
import com.upresent.user.utils.RestUtils;

@RestController
@RequestMapping(value = "/user")
public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping
	public ResponseEntity<RestResponse<String>> registerUser(
			@RequestBody UserDetail userDetail) {
		return RestUtils.successResponse(userService.registerUser(userDetail));
	}

	@GetMapping
	public ResponseEntity<RestResponse<UserDetail>> fetchUser(String username) {
		return RestUtils.successResponse(userService.fetchUser(username));
	}

	@GetMapping("/all")
	public ResponseEntity<RestResponse<Iterable<UserDetail>>> fetchAllUsers() {
		return RestUtils.successResponse(userService.fetchAllUsers());
	}

	@PutMapping
	public ResponseEntity<RestResponse<String>> updateUser(
			@RequestBody UserDetail userDetail) {
		return RestUtils.successResponse(userService.updateUser(userDetail));
	}

	@DeleteMapping
	public ResponseEntity<RestResponse<String>> deleteUser(String username) {
		return RestUtils.successResponse(userService.deleteUser(username));
	}
	
}