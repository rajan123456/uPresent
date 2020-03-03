package com.upresent.metrics.subscriber;

import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import com.upresent.metrics.entity.MetricsData;
import com.upresent.metrics.exception.ExceptionResponseCode;
import com.upresent.metrics.exception.MetricsException;
import com.upresent.metrics.service.MetricsService;

@Service
public class KafkaReceiver {

	@Autowired
	private MetricsService metricsService;

	private static final Logger LOG = LoggerFactory.getLogger(KafkaReceiver.class);

	@KafkaListener(topics = {"managementEvents" , "userEvents"})
	public void listen(@Payload String message) {
		LOG.info("received message='{}'", message);
		metricsService.addMetricsData(constructMetricsData(message));
	}

	private MetricsData constructMetricsData(String eventString) {
		try {
			List<String> eventList = Arrays.asList(eventString.split(";"));
			MetricsData metricsData = new MetricsData();
			metricsData.setEventType(eventList.get(1));
			metricsData.setEventData(eventList.get(0));
			metricsData.setSourceId(eventList.get(4));
			metricsData.setTimeStamp(eventList.get(2));
			return metricsData;
		} catch (Exception e) {
			throw new MetricsException(ExceptionResponseCode.USER_DATA_NOT_FOUND_IN_REQUEST);
		}
	}

}