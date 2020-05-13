package com.upresent.management.service;

import com.upresent.management.entity.GeoFenceData;
import com.upresent.management.entity.SchoolData;
import com.upresent.management.exception.ManagementException;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Service
public interface SchoolService {
    String createSchool(SchoolData schoolData) throws ManagementException;

    String updateSchool(SchoolData schoolData) throws ManagementException;

    String deleteSchool(HttpServletRequest request, String schoolCode) throws ManagementException;

    SchoolData getSchool(String schoolCode) throws ManagementException;

    List<SchoolData> getAllSchools() throws ManagementException;

    GeoFenceData fetchGeoFence(String schoolCode) throws ManagementException;
}
