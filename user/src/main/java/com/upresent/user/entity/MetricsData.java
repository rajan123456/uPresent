package com.upresent.user.entity;

import lombok.Data;

@Data
public class MetricsData {

    private String eventType;
    private String eventData;
    private String timeStamp;
    private String sourceId;
}