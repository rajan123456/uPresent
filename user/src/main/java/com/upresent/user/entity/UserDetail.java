package com.upresent.user.entity;

import java.security.Key;
import java.util.Base64;
import java.util.List;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Document(collection = "userDetail")
public class UserDetail {

	@Id
	@JsonIgnore
	private String userId;
	private String name;
	@JsonIgnore
	private String password;
	private String username;
	private String userType="student";
	private List<String> imageId;
	private Integer isActive;

	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPassword() {
		try {
			String key = "Bar12345Bar12345";
			Key aesKey = new SecretKeySpec(key.getBytes(), "AES");
			Cipher cipher = Cipher.getInstance("AES");
			cipher.init(Cipher.DECRYPT_MODE, aesKey);
			return new String(cipher.doFinal(Base64.getDecoder().decode(password)));
		} catch (Exception e) {
			return password;
		}
	}
	public void setPassword(String password) {
		try {
			String key = "Bar12345Bar12345";
			Key aesKey = new SecretKeySpec(key.getBytes(), "AES");
			Cipher cipher = Cipher.getInstance("AES");
			cipher.init(Cipher.ENCRYPT_MODE, aesKey);
			this.password = Base64.getEncoder().encodeToString(cipher.doFinal(password.getBytes("UTF-8")));
		} catch (Exception e) {
			this.password = password;
		}
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}
	public List<String> getImageId() {
		return imageId;
	}
	public void setImageId(List<String> imageId) {
		this.imageId = imageId;
	}
	public Integer getIsActive() {
		return isActive;
	}
	public void setIsActive(Integer isActive) {
		this.isActive = isActive;
	}
	@Override
	public String toString() {
		return "UserDetail [userId=" + userId + ", name=" + name + ", username=" + username
				+ ", userType=" + userType + ", imageId=" + imageId + ", isActive=" + isActive + "]";
	}
	

}