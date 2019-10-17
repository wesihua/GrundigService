package com.pangoo.grundig.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * 系统启动后执行一些操作，eg:将地区，字典放入redis中
 * @author weisihua
 * 2018年8月9日 下午4:37:16
 */
@Component
public class MyApplicationRunner implements ApplicationRunner {

	public static final Logger log = LoggerFactory.getLogger(MyApplicationRunner.class);
	
	@Override
	public void run(ApplicationArguments args) throws Exception {

	}

}
