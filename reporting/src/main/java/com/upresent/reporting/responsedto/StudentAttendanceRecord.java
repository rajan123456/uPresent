package com.upresent.reporting.responsedto;

import lombok.Data;

@Data
public class StudentAttendanceRecord {
	String studentUsername;
	String attendance;
	String capturedImageId;
	String recognitionSource;
	String recognitionConfidence;
	String timestamp;
	String adminUsername;
}
