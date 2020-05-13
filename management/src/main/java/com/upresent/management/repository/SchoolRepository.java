package com.upresent.management.repository;

import com.upresent.management.entity.SchoolData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SchoolRepository extends MongoRepository<SchoolData, String> {
    public Optional<SchoolData> findById(String schoolCode);
}
