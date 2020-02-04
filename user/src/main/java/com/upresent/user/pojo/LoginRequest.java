package com.upresent.user.pojo;

import lombok.Data;

@Data
public class LoginRequest {

	private String password;
	private String username;	
}