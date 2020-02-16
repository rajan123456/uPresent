package com.upresent.management;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootTest;

import static org.powermock.api.mockito.PowerMockito.mockStatic;
import static org.powermock.api.mockito.PowerMockito.verifyStatic;

@RunWith(PowerMockRunner.class)
@SpringBootTest
public class ManagementApplicationTests {

	@Test
	@PrepareForTest(SpringApplication.class)
	public void contextLoads() {
		mockStatic(SpringApplication.class);
		ManagementApplication.main(new String[]{"Hello", "World"});
		verifyStatic(SpringApplication.class);
		SpringApplication.run(ManagementApplication.class, "Hello", "World");
	}
}