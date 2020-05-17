package com.upresent.reporting.responsedto;

import lombok.Data;

@Data
public class ScheduleRecord {
    String date;
    String startTime;
    String endTime;
    String createdBy;
}
