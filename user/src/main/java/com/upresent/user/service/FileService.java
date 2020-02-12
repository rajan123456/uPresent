package com.upresent.user.service;

import org.springframework.web.multipart.MultipartFile;

import com.upresent.user.exception.UserException;

public interface FileService {

	public String uploadUserImage(MultipartFile file) throws UserException;

}