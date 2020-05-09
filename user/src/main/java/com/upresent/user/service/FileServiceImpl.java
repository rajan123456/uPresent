package com.upresent.user.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
			String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
			Path copyLocation = Paths
					.get(env.getProperty("uploadDir") + uniqueFileName);
			if (!Files.exists(copyLocation.getParent()))
				Files.createDirectories(copyLocation.getParent());
			Files.copy(file.getInputStream(), copyLocation, StandardCopyOption.REPLACE_EXISTING);
			return uniqueFileName;
		} catch (Exception e) {
			throw new UserException(ExceptionResponseCode.GENERAL_ERROR);
		}
	}

	@Override
	public ResponseEntity<byte[]> getUserImage(String filename) throws IOException {
		Path fileLocation = Paths.get(env.getProperty("uploadDir") + filename);
		if(!Files.exists(fileLocation))
			throw new UserException(ExceptionResponseCode.USER_DATA_NOT_FOUND);
		else {
			InputStream in = Files.newInputStream(fileLocation);
			final HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.IMAGE_JPEG);
			return new ResponseEntity<byte[]>(IOUtils.toByteArray(in), headers, HttpStatus.OK);
		}
	}
}