package com.upresent.reporting.subscriber;

import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import com.upresent.reporting.entity.ReportingData;
import com.upresent.reporting.exception.ExceptionResponseCode;
import com.upresent.reporting.exception.ReportingException;
import com.upresent.reporting.service.ReportingService;

@Service
public class KafkaReceiver {

	@Autowired
	private ReportingService reportingService;

	private static final Logger LOG = LoggerFactory.getLogger(KafkaReceiver.class);

	@KafkaListener(topics = {"managementEvents" , "userEvents", "attendanceEvents"})
	public void listen(@Payload String message) {
		LOG.info("received message='{}'", message);
		reportingService.addReportingData(constructReportingData(message));
	}

	private ReportingData constructReportingData(String eventString) {
		try {
			List<String> eventList = Arrays.asList(eventString.split(";"));
			ReportingData metricsData = new ReportingData();
			metricsData.setEventType(eventList.get(1));
			metricsData.setEventData(eventList.get(0));
			metricsData.setSourceId(eventList.get(4));
			metricsData.setTimeStamp(eventList.get(2));
			return metricsData;
		} catch (Exception e) {
			throw new ReportingException(ExceptionResponseCode.USER_DATA_NOT_FOUND_IN_REQUEST);
		}
	}

}