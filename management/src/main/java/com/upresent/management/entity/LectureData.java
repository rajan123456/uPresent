package com.upresent.management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.Date;

@Data
public class LectureData {
    @Id
    @JsonIgnore
    private String id;
    private String date; //pattern = "MM/dd/yyyy"
    private String startTime; //pattern = "13:59"
    private String endTime; //pattern = "17:59"
    private String createdBy;
    @JsonIgnore
    @LastModifiedDate
    private Date updatedOn;
}
