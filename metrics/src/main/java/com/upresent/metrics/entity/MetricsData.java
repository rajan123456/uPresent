package com.upresent.metrics.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Document(collection = "metrics")
public class MetricsData {

	@JsonIgnore
	@Id
    private String eventId;
    private String eventType;
    private String eventData;
    private String timeStamp;
    private String sourceId;
}