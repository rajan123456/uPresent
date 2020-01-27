package com.upresent.user.enums;

public enum UserType {

	STUDENT("Student"), ADMIN("Admin");

	private String type;

	public String value() {
		return type;
	}

	UserType(String type) {
		this.type = type;
	}
}