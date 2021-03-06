package com.upresent.management.service;

import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.upresent.management.entity.ModuleData;
import com.upresent.management.entity.SchoolData;
import com.upresent.management.exception.ExceptionResponseCode;
import com.upresent.management.exception.ManagementException;
import com.upresent.management.producer.KafkaMessageProducer;
import com.upresent.management.producer.RestMessageProducer;
import com.upresent.management.repository.ModuleRepository;
import com.upresent.management.repository.SchoolRepository;
import com.upresent.management.utils.CommonUtility;
import com.upresent.management.utils.Constant;
import com.upresent.management.utils.UserModuleUtil;

@Service
public class AdminModuleServiceImpl implements AdminModuleService {

	@Autowired
	private KafkaMessageProducer kafkaMessageProducer;

	@Autowired
	private RestMessageProducer restMessageProducer;

	@Autowired
	private ModuleRepository moduleRepository;

	@Autowired
	private SchoolRepository schoolRepository;

	@Autowired
	UserModuleUtil userModuleUtil;

	@Autowired
	Environment env;

	Gson gson = new Gson();

	@Override
	public String createModule(ModuleData moduleData) throws ManagementException {
		if (userModuleUtil.isAdmin(moduleData.getCreatedBy())) {
			Optional<ModuleData> optionalExistingModule = moduleRepository.findById(moduleData.getModuleCode());
			if (optionalExistingModule.isPresent()) {
				throw new ManagementException(ExceptionResponseCode.MODULE_ALREADY_EXISTS);
			} else {
				Optional<SchoolData> optionalExistingSchool = schoolRepository.findById(moduleData.getSchoolCode());
       			if(!optionalExistingSchool.isPresent()) {
					throw new ManagementException((ExceptionResponseCode.DATA_NOT_FOUND));
				}
				int idealNumberOfStudents = moduleData.getStudentUsernames().size();
				if (idealNumberOfStudents > 0) {
					Map<String, Object> userTypes = userModuleUtil
							.getUserTypesFromUsernames(moduleData.getStudentUsernames());
					//noinspection unchecked
					List<String> students = (List<String>) userTypes.get("student");
					if (students.size() != idealNumberOfStudents) {
						throw new ManagementException(ExceptionResponseCode.ALL_USERS_NOT_STUDENTS);
					}
				}
				ModuleData module = moduleRepository.save(moduleData);
				publishAdminModuleUpdates(module, Constant.MODULE_CREATED_EVENT);
			}
		} else {
			throw new ManagementException(ExceptionResponseCode.UNAUTHORISED);
		}
		return "A new module has been successfully created.";
	}

	@Override
	public String updateModule(ModuleData moduleData) throws ManagementException {
		if (userModuleUtil.isAdmin(moduleData.getCreatedBy())) {
			Optional<ModuleData> optionalExistingModule = moduleRepository.findById(moduleData.getModuleCode());
			if (optionalExistingModule.isPresent()) {
				int idealNumberOfStudents = moduleData.getStudentUsernames().size();
				if (idealNumberOfStudents > 0) {
					Map<String, Object> userTypes = userModuleUtil
							.getUserTypesFromUsernames(moduleData.getStudentUsernames());
					//noinspection unchecked
					List<String> students = (List<String>) userTypes.get("student");
					if (students.size() != idealNumberOfStudents) {
						throw new ManagementException(ExceptionResponseCode.ALL_USERS_NOT_STUDENTS);
					}
				}
				ModuleData module = moduleRepository.save(moduleData);
				publishAdminModuleUpdates(module, Constant.MODULE_UPDATED_EVENT);
			} else {
				throw new ManagementException(ExceptionResponseCode.MODULE_DOES_NOT_EXIST);
			}
		} else {
			throw new ManagementException(ExceptionResponseCode.UNAUTHORISED);
		}
		return "Module has been successfully updated.";
	}

	@Override
	public ModuleData getModule(String moduleCode) throws ManagementException {
		Optional<ModuleData> optionalModuleInfo = moduleRepository.findById(moduleCode);
		if (optionalModuleInfo.isPresent()) {
			return optionalModuleInfo.get();
		}
		throw new ManagementException(ExceptionResponseCode.MODULE_DOES_NOT_EXIST);
	}

	@Override
	public List<ModuleData> getAllModules() {
		return moduleRepository.findAll();
	}

	@Override
	public String deleteModule(HttpServletRequest request, String moduleCode) throws ManagementException {
		String username = request.getHeader("Username");
		if (username == null) {
			throw new ManagementException(ExceptionResponseCode.MISSING_HEADER_KEY);
		}
		if (userModuleUtil.isAdmin(username)) {
			Optional<ModuleData> optionalModuleInfo = moduleRepository.findById(moduleCode);
			if (optionalModuleInfo.isPresent()) {
				moduleRepository.deleteById(moduleCode);
				publishAdminModuleUpdates(optionalModuleInfo.get(), Constant.MODULE_DELETED_EVENT);
				return "Module successfully deleted.";
			} else {
				throw new ManagementException(ExceptionResponseCode.MODULE_DOES_NOT_EXIST);
			}
		} else {
			throw new ManagementException(ExceptionResponseCode.UNAUTHORISED);
		}
	}

	private void publishAdminModuleUpdates(ModuleData module, String eventType) {
		String message = CommonUtility.stringifyEventForPublish(gson.toJson(module), eventType,
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