package com.upresent.user.service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.upresent.user.exception.UserException;

import java.io.IOException;

public interface FileService {

	public String uploadUserImage(MultipartFile file) throws UserException;

	public ResponseEntity<byte[]> getUserImage(String filename) throws IOException;
}