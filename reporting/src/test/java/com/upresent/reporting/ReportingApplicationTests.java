package com.upresent.reporting;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootTest;
import com.upresent.reporting.ReportingApplication;

import static org.powermock.api.mockito.PowerMockito.mockStatic;
import static org.powermock.api.mockito.PowerMockito.verifyStatic;

@RunWith(PowerMockRunner.class)
@SpringBootTest
class ReportingApplicationTests {

	@Test
	@PrepareForTest(SpringApplication.class)
	public void contextLoads() {
		mockStatic(SpringApplication.class);
		ReportingApplication.main(new String[]{"Hello", "World"});
		verifyStatic(SpringApplication.class);
		SpringApplication.run(ReportingApplication.class, "Hello", "World");
	}

}
