package com.upresent.management.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.upresent.management.entity.ModuleData;

@Repository
public interface ModuleRepository extends MongoRepository<ModuleData, String> {
	
	public Optional<ModuleData> findById(String moduleCode);
}