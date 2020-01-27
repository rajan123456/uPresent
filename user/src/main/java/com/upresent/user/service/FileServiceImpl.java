package com.upresent.user.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.upresent.user.exception.UserException;

@Service
public class FileServiceImpl implements FileService {

	@Override
	public String uploadUserImage(MultipartFile file) throws UserException {
//		if (CommonUtility.isNullObject(file.getBytes())) {
//			
//		}
		
		
		return null;
	}
}