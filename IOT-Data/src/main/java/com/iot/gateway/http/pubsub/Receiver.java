package com.iot.gateway.http.pubsub;

import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.iot.gateway.http.websocket.Socket;

public class Receiver {
	
	
	private static final Logger log = LoggerFactory.getLogger(Receiver.class);

	 private AtomicInteger counter = new AtomicInteger();

	    public void receiveMessage(String message) {
	    	Socket.broadcast(message);
	    	log.info("Received <" + message + ">");
	        counter.incrementAndGet();
	    }

	    public int getCount() {
	        return counter.get();
	    }
}
