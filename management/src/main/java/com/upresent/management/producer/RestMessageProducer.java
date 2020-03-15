package com.upresent.management.producer;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.upresent.management.entity.MetricsData;
import com.upresent.management.exception.ExceptionResponseCode;
import com.upresent.management.exception.ManagementException;

@Service
public class RestMessageProducer {

	@Autowired
	private Environment env;

	@Autowired
	private RestTemplate restTemplate;

	public String send(String message) {
		String url = env.getProperty("metrics.publisher.api");
		HttpHeaders headers = new HttpHeaders();
		headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
		HttpEntity<?> entity = new HttpEntity<>(constructMetricsData(message), headers);
		ResponseEntity<String> response =
				restTemplate.exchange(url, HttpMethod.POST,
						entity, String.class);
		return response.getBody();
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
			throw new ManagementException(ExceptionResponseCode.INVALID_REQUEST);
		}
	}
}
