package com.upresent.reporting.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Document(collection = "reporting")
public class ReportingData {

	@JsonIgnore
	@Id
	private String eventId;
	private String eventType;
	private String eventData;
	private String timeStamp;
	private String sourceId;
}