package com.upresent.user.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.upresent.user.exception.ExceptionResponseCode;
import com.upresent.user.exception.UserException;
import com.upresent.user.utils.CommonUtility;

@Service
public class FileServiceImpl implements FileService {

	@Autowired
	private Environment env;

	@Override
	public String uploadUserImage(MultipartFile file) throws UserException {
		if (CommonUtility.isNullObject(file))
			throw new UserException(ExceptionResponseCode.USER_DATA_NOT_FOUND_IN_REQUEST);
		try {
			String uniqueFileName = UUID.randomUUID().toString() + file.getOriginalFilename();
			Path copyLocation = Paths
					.get(env.getProperty("uploadDir") + uniqueFileName);
			Files.copy(file.getInputStream(), copyLocation, StandardCopyOption.REPLACE_EXISTING);
			return uniqueFileName;
		} catch (Exception e) {
			throw new UserException(ExceptionResponseCode.GENRAL_ERROR);
		}
	}
}