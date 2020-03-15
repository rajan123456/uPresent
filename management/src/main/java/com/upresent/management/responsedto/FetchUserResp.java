package com.upresent.management.responsedto;

import java.util.List;

import lombok.Data;

@Data
public class FetchUserResp {

	private String name;
	private String username;
	private String userType;
	private List<String> imageId;
	private Integer isActive;

}
