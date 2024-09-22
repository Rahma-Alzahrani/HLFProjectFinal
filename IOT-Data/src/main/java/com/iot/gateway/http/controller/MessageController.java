package com.iot.gateway.http.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.iot.gateway.http.service.DeviceMessagePublisher;

@RequestMapping("/messages")
@RestController
public class MessageController {

	private final DeviceMessagePublisher messagePublisher;

	public MessageController(DeviceMessagePublisher messagePublisher) {
		this.messagePublisher = messagePublisher;
	}

	@PostMapping
	public ResponseEntity<String> createMessage(@RequestBody String message) {
		this.messagePublisher.publish(message);

		return ResponseEntity.ok(message);
	}
}