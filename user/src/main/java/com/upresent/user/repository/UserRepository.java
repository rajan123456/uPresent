package com.upresent.user.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.upresent.user.entity.UserDetail;

@Repository
public interface UserRepository extends MongoRepository<UserDetail, String> {
	UserDetail findByUsernameAndIsActive(String username, Integer isActive);
	UserDetail findByUsername(String username);
	List<UserDetail> findAll();
	List<UserDetail> findByUsernameIn(List<String> username);
	List<UserDetail> findByUserTypeIn(String userType);
}