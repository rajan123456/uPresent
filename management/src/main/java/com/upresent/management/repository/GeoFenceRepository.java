package com.upresent.management.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.upresent.management.entity.GeoFenceData;

@Repository
public interface GeoFenceRepository extends MongoRepository<GeoFenceData, String> {
	
	List<GeoFenceData> findByUniversityName(String universityName);
}