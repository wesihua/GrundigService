package com.pangoo.grundig.controller;

import javax.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoController {

	@RequestMapping("/hello")
	public String home() {
		return "hello world";
	}
	
	@RequestMapping("/download")
	public void download(HttpServletResponse response) {

	}
}
