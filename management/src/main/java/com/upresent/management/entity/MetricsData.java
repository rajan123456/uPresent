package com.upresent.management.entity;

import lombok.Data;

@Data
public class MetricsData {

    private String eventType;
    private String eventData;
    private String timeStamp;
    private String sourceId;
}