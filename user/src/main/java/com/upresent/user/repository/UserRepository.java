package com.upresent.user.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.upresent.user.entity.UserDetail;

@Repository
public interface UserRepository extends MongoRepository<UserDetail, String> {
	List<UserDetail> findByUsername(String username);
	List<UserDetail> findAll();
}