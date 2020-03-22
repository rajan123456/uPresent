package com.upresent.management.entity;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;

import lombok.Data;

@Data
public class ModuleData {

	@Id
	private String moduleCode;
    private String moduleName;
//  pattern = "MM/dd/yyyy"
    private String startDate;
//  pattern = "MM/dd/yyyy"
    private String endDate;
    // Mon, Tue, Wed, Thur, Fri, Sat, Sun
    private List<String> scheduledDays;
    private String createdBy;
    @LastModifiedDate
    private Date updatedOn;
    private List<String> studentUsernames;
}