package com.iot.gateway.http.websocket;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
@ServerEndpoint(value = "/webSocket/{device_id}", encoders = MessageEncoder.class, decoders = MessageDecoder.class)
public class Socket {
	private Session session;
	public static Map<String, Socket> listeners = new HashMap<>();
	private String deviceId;
	private static final Logger log = LoggerFactory.getLogger(Socket.class);

	@OnOpen
	public void onOpen(Session session) throws InterruptedException {
		this.session = session;

		this.deviceId = (String) session.getPathParameters().get("device_id");
		if (listeners.containsKey(deviceId)) {
			try {
				session.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		listeners.put(this.deviceId, this);
		log.info(String.format("New session connected! with Id:" + this.deviceId + " Connected listeners: %s",
				listeners.size()));
	}

	@OnMessage // Allows the client to send message to the socket.
	public void onMessage(String message) {
		broadcast(message);
	}

	@OnClose
	public void onClose(Session session) {
		String data = this.deviceId = (String) session.getPathParameters().get("device_id");

		listeners.remove(data);
		log.info(String.format("Session disconnected with DeciceId: " + data + ". Total connected listeners: %s",
				listeners.size()));
	}

	@OnError
	public void onError(Session session, Throwable throwable) {
		String data = this.deviceId = (String) session.getPathParameters().get("device_id");

		listeners.remove(data);
		log.info(String.format("Session disconnected with DeciceId: " + data + ". Total connected listeners: %s",
				listeners.size()));

	}

	public static void broadcast(String message) {
		// for (Socket listener : listeners.values()) {
		Message deviceMessage = null;
		try {
			log.debug(message);
			deviceMessage = new ObjectMapper().readValue(message, Message.class);
			log.debug("device message after conversion", deviceMessage);
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Socket listener = listeners.get(deviceMessage.getDeviceId());
		if (listener != null)
			listener.sendMessage(message);
		else
			log.debug("device is not connected with server {}",deviceMessage.getDeviceId());
		// }
	}

	private void sendMessage(String message) {
		try {
			this.session.getBasicRemote().sendText(message);
		} catch (IOException e) {
			log.error("Caught exception while sending message to Session Id: " + this.session.getId(), e.getMessage(),
					e);
		}
	}
}