package com.upresent.management.requestdto;

import com.upresent.management.utils.Constant;

import lombok.Data;

@Data
public class GeoFenceReq {

	public String username;
	public String universityName = Constant.UNIVERSITY_NAME;
	public Float latitude;
	public Float longitude;
	public Float radiusInMeter;
	
}
