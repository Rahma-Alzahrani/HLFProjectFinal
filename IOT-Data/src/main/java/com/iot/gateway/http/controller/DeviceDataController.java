package com.iot.gateway.http.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DeviceDataController {

	
	private static final Logger log = LoggerFactory.getLogger(DeviceDataController.class);

	@RequestMapping("/data")
	@ResponseBody
	private boolean deviceData() {
		
		log.info("data recieved ");
		
		return true;

	}

}
