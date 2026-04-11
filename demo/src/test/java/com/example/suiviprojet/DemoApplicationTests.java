package com.example.suiviprojet;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("MySQL requis - tests via Docker uniquement")
class DemoApplicationTests {

	@Test
	void contextLoads() {
	}
}