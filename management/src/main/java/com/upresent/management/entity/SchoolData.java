package com.upresent.management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.Date;
import java.util.List;

@Data
public class SchoolData {
    @Id
    private String schoolCode;
    private String schoolName;
    private List<Date> holidays;
    private GeoFenceData geoFenceData;
    private String createdBy;
    @JsonIgnore
    @LastModifiedDate
    private Date updatedOn;
}
