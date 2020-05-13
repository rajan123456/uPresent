package com.upresent.management.entity;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;

import lombok.Data;

@Data
public class ModuleData {

	@Id
	private String moduleCode;
	private String schoolCode;
    private String moduleName;
    private String startDate; //pattern = "MM/dd/yyyy"
    private String endDate; //pattern = "MM/dd/yyyy"
    private List<LectureData> schedule;
    private String createdBy;
    @JsonIgnore
    @LastModifiedDate
    private Date updatedOn;
    private List<String> studentUsernames;
}