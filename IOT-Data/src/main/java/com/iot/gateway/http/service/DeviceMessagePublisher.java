package com.iot.gateway.http.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

@Service
public class DeviceMessagePublisher{
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic topic;

private static final Logger log = LoggerFactory.getLogger(DeviceMessagePublisher.class);


    public DeviceMessagePublisher(RedisTemplate<String, Object> redisTemplate, ChannelTopic topic){
        this.redisTemplate = redisTemplate;
        this.topic = topic;
    }

    public void publish(String message){
    	
    	log.info("******************************************************************************");
        log.info("Messages published on Channel: {}, Message: {}", topic, message);
    	  log.info("******************************************************************************");
        this.redisTemplate.convertAndSend(topic.getTopic(), message);
      
    }
}
