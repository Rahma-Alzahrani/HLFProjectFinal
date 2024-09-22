package com.iot.gateway.http.pubsub;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisPublisher {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void publish(String message) {
        try{
            System.out.println("Publishing message to Redis Channel: "+message);
            redisTemplate.convertAndSend("device_cmd", message);
            System.out.println("Message sent to Redis Channel: "+message);
        }catch(Exception e) {
        	System.out.println("Exception in RedisPublisher: "+e.getMessage());
        }
    }
}
