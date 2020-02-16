package com.upresent.management.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.upresent.management.entity.UserDetail;

@Repository
public interface UserRepository extends MongoRepository<UserDetail, String> {

	List<UserDetail> findByUsername(String username);
	List<UserDetail> findByName(String name);
	List<UserDetail> findByUserType(String userType);
}