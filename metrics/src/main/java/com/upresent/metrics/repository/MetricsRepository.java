package com.upresent.metrics.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.upresent.metrics.entity.MetricsData;

@Repository
public interface MetricsRepository extends MongoRepository<MetricsData, String> {
}