package com.upresent.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.upresent.user.service.FileService;
import com.upresent.user.utils.RestResponse;
import com.upresent.user.utils.RestUtils;

@Controller
@RequestMapping("/file")
public class FileController {

	@Autowired
	private FileService fileService;
	
	@PostMapping
	public ResponseEntity<RestResponse<String>> uploadUserImage(
			@RequestParam("file") MultipartFile file) {
		return RestUtils.successResponse(fileService.uploadUserImage(file));
	}

}