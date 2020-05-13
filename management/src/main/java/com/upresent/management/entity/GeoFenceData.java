package com.upresent.management.entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
public class GeoFenceData {

	@Id
	@JsonIgnore
	private String id;
	@JsonIgnore
    private String username;
    private Float latitude;
    private Float longitude;
    private Float radiusInMeter;
	@JsonIgnore
    @LastModifiedDate
    private Date updatedOn;
}