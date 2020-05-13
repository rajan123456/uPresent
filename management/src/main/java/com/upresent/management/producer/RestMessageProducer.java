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

import com.upresent.management.entity.ReportsData;
import com.upresent.management.exception.ExceptionResponseCode;
import com.upresent.management.exception.ManagementException;

@Service
public class RestMessageProducer {

	@Autowired
	private Environment env;

	@Autowired
	private RestTemplate restTemplate;

	public String send(String message) {
		String url = env.getProperty("reporting.publisher.api");
		HttpHeaders headers = new HttpHeaders();
		headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
		HttpEntity<?> entity = new HttpEntity<>(constructReportingData(message), headers);
		ResponseEntity<String> response =
				restTemplate.exchange(url, HttpMethod.POST,
						entity, String.class);
		return response.getBody();
	}

	private ReportsData constructReportingData(String eventString) {
		try {
			List<String> eventList = Arrays.asList(eventString.split(";"));
			ReportsData reportsData = new ReportsData();
			reportsData.setEventType(eventList.get(1));
			reportsData.setEventData(eventList.get(0));
			reportsData.setSourceId(eventList.get(4));
			reportsData.setTimeStamp(eventList.get(2));
			return reportsData;
		} catch (Exception e) {
			throw new ManagementException(ExceptionResponseCode.INVALID_REQUEST);
		}
	}
}
