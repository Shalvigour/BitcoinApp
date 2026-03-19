package com.example.Bitcoin.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // Ye annotation bean create karega
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Frontend is path par subscribe karega: /topic/arbitrage-alerts
        config.enableSimpleBroker("/topic");
        // Frontend se backend message bhejne ke liye prefix (optional for us)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Frontend is URL se connect karega: ws://localhost:8081/bitcoin-ws
        registry.addEndpoint("/bitcoin-ws")
                .setAllowedOriginPatterns("*") // Frontend connection allow karne ke liye
                .withSockJS(); // Compatibility ke liye
    }
}
