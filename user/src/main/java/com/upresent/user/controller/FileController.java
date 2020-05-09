package com.upresent.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.upresent.user.service.FileService;
import com.upresent.user.utils.RestResponse;
import com.upresent.user.utils.RestUtils;

import java.io.IOException;

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

	@ResponseBody
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.IMAGE_JPEG_VALUE)
	public ResponseEntity<byte[]> getUserFile(String filename) throws IOException {
		return fileService.getUserImage(filename);
	}

}