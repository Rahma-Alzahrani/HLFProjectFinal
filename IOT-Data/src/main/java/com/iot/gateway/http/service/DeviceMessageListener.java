package com.iot.gateway.http.service;


import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iot.gateway.http.Dto.MessageDto;
import com.iot.gateway.http.websocket.Socket;

import lombok.extern.slf4j.Slf4j;




@Service
public class DeviceMessageListener implements MessageListener {

    private final ObjectMapper objectMapper;
    
	private static final Logger log = LoggerFactory.getLogger(DeviceMessageListener.class);


    public DeviceMessageListener(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        //try {
           // MessageDto msg = objectMapper.readValue(message.getBody(), MessageDto.class);
            if(message != null) {
            	log.info("******************************************************************************");
                log.info("Messages recieved on Channel: {}, Message: {}", new String(message.getChannel()), message);
                log.info("******************************************************************************");
                log.info(message.toString());
                Socket.broadcast(message.toString());

            }
            
//        } catch (IOException e) {
//            log.error("Couldn't convert json", e);
//        }
    }
}