package com.upresent.reporting.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.upresent.reporting.entity.ReportingData;

@Repository
public interface ReportingRepository extends MongoRepository<ReportingData, String> {
	
}