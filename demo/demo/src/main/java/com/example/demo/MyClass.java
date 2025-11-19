package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyClass {

	@GetMapping("name")
	public String GetMyName() {
		return "hello";
	}
}
