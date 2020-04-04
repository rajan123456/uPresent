package com.upresent.management.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.upresent.management.entity.GeoFenceData;

import java.util.List;

@Repository
public interface GeoFenceRepository extends MongoRepository<GeoFenceData, String> {

	GeoFenceData findByUniversityName(String universityName);

	List<GeoFenceData> findAll();
}