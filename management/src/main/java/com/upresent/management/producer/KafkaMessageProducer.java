package com.upresent.management.producer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.upresent.management.utils.Constant;

@Service
public class KafkaMessageProducer {

	@Autowired
	private Environment env;

	@Autowired
	private KafkaTemplate<String, String> kafkaTemplate;

	public void send(String message){
		kafkaTemplate.send(env.getProperty(Constant.MANAGEMENT_PUBLISHER_TOPIC), message);
	}
}