package com.upresent.management.service;

import com.google.gson.Gson;
import com.upresent.management.entity.GeoFenceData;
import com.upresent.management.entity.SchoolData;
import com.upresent.management.exception.ExceptionResponseCode;
import com.upresent.management.exception.ManagementException;
import com.upresent.management.producer.KafkaMessageProducer;
import com.upresent.management.producer.RestMessageProducer;
import com.upresent.management.repository.SchoolRepository;
import com.upresent.management.utils.CommonUtility;
import com.upresent.management.utils.Constant;
import com.upresent.management.utils.UserModuleUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

@Service
public class SchoolServiceImpl implements SchoolService {

    @Autowired
    private KafkaMessageProducer kafkaMessageProducer;

    @Autowired
    private RestMessageProducer restMessageProducer;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    UserModuleUtil userModuleUtil;

    @Autowired
    Environment env;

    Gson gson = new Gson();

    @Override
    public String createSchool(SchoolData schoolData) throws ManagementException {
        if (userModuleUtil.isAdmin(schoolData.getCreatedBy())) {
            Optional<SchoolData> optionalExistingSchool = schoolRepository.findById(schoolData.getSchoolCode());
            if (optionalExistingSchool.isPresent()) {
                throw new ManagementException(ExceptionResponseCode.SCHOOL_ALREADY_EXISTS);
            } else {
                 if (!(CommonUtility.isValidLatitude(schoolData.getGeoFenceData().getLatitude())
                            && CommonUtility.isValidLongitude(schoolData.getGeoFenceData().getLongitude())
                            && schoolData.getGeoFenceData().getRadiusInMeter() > 0)) {
                        throw new ManagementException(ExceptionResponseCode.INVALID_REQUEST);
                    }
                SchoolData school = schoolRepository.save(schoolData);
                publishAdminSchoolUpdates(school, Constant.SCHOOL_CREATED_EVENT);
            }
        } else {
            throw new ManagementException(ExceptionResponseCode.UNAUTHORISED);
        }
        return "A new school has been successfully created.";
    }

    @Override
    public String updateSchool(SchoolData schoolData) throws ManagementException {
        if (userModuleUtil.isAdmin(schoolData.getCreatedBy())) {
            Optional<SchoolData> optionalExistingSchool = schoolRepository.findById(schoolData.getSchoolCode());
            if (optionalExistingSchool.isPresent()) {
                if (!(CommonUtility.isValidLatitude(schoolData.getGeoFenceData().getLatitude())
                        && CommonUtility.isValidLongitude(schoolData.getGeoFenceData().getLongitude())
                        && schoolData.getGeoFenceData().getRadiusInMeter() > 0)) {
                    throw new ManagementException(ExceptionResponseCode.INVALID_REQUEST);
                }
                SchoolData school = schoolRepository.save(schoolData);
                publishAdminSchoolUpdates(school, Constant.SCHOOL_UPDATED_EVENT);
            } else {
                throw new ManagementException(ExceptionResponseCode.SCHOOL_DOES_NOT_EXIST);
            }
        } else {
            throw new ManagementException(ExceptionResponseCode.UNAUTHORISED);
        }
        return "School has been successfully updated.";
    }

    @Override
    public String deleteSchool(HttpServletRequest request, String schoolCode) throws ManagementException {
        String username = request.getHeader("Username");
        if (username == null) {
            throw new ManagementException(ExceptionResponseCode.MISSING_HEADER_KEY);
        }
        if (userModuleUtil.isAdmin(username)) {
            Optional<SchoolData> optionalSchoolInfo = schoolRepository.findById(schoolCode);
            if (optionalSchoolInfo.isPresent()) {
                schoolRepository.deleteById(schoolCode);
                publishAdminSchoolUpdates(optionalSchoolInfo.get(), Constant.SCHOOL_DELETED_EVENT);
                return "School successfully deleted.";
            } else {
                throw new ManagementException(ExceptionResponseCode.SCHOOL_DOES_NOT_EXIST);
            }
        } else {
            throw new ManagementException(ExceptionResponseCode.UNAUTHORISED);
        }
    }

    @Override
    public SchoolData getSchool(String schoolCode) throws ManagementException {
        Optional<SchoolData> optionalSchoolData = schoolRepository.findById(schoolCode);
        if (optionalSchoolData.isPresent()) {
            return optionalSchoolData.get();
        }
        throw new ManagementException(ExceptionResponseCode.SCHOOL_DOES_NOT_EXIST);
    }

    @Override
    public List<SchoolData> getAllSchools() throws ManagementException {
        return schoolRepository.findAll();
    }

    @Override
    public GeoFenceData fetchGeoFence(String schoolCode) throws ManagementException {
        Optional<SchoolData> optionalSchoolData = schoolRepository.findById(schoolCode);
        if(optionalSchoolData.isPresent()) {
            return optionalSchoolData.get().getGeoFenceData();
        } else {
            throw new ManagementException(ExceptionResponseCode.DATA_NOT_FOUND);
        }
    }

    private void publishAdminSchoolUpdates(SchoolData school, String eventType) {
        String message = CommonUtility.stringifyEventForPublish(gson.toJson(school), eventType,
                Calendar.getInstance().getTime().toString(), "", Constant.MANAGEMENT_SOURCE_ID);
        String useMessagePublisher = System.getenv(Constant.SAGA_ENABLED_ENV_VARIABLE) == null
                ? env.getProperty(Constant.SAGA_ENABLED_ENV_VARIABLE)
                : System.getenv(Constant.SAGA_ENABLED_ENV_VARIABLE);
        if (null == useMessagePublisher || 1 == Integer.parseInt(useMessagePublisher)) {
            kafkaMessageProducer.send(message);
        } else {
            restMessageProducer.send(message);
        }
    }

}
