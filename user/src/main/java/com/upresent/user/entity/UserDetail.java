package com.upresent.user.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Document(collection = "userDetail")
public class UserDetail {

	@JsonIgnore
	@Id
	private String userId;
	private String name;
	@JsonIgnore
	private String password;
	private String registrationNumber;
	private String userType;
	@GeoSpatialIndexed
	private double[] location;
	private String imageId;
	private Integer isActive;
}