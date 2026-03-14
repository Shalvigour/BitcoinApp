package com.example.Bitcoin.service;

import jakarta.annotation.PostConstruct;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.net.URI;

@Service
public class KrakenStreamService {
    private final String KRAKEN_URL = "wss://ws.kraken.com";

    @Autowired
    private MarketDataProducer producer;

    @PostConstruct
    public void connect() {
        try {
            WebSocketClient client = new WebSocketClient(new URI(KRAKEN_URL)) {
                @Override
                public void onOpen(ServerHandshake handshakedata) {
                    System.out.println("✅ Connected to Kraken WebSocket");
                    // Kraken uses slash (/) and USD
                    String subscribeMessage = "{" +
                            "\"event\":\"subscribe\"," +
                            "\"pair\":[" +
                            "\"BTC/USD\",\"ETH/USD\",\"SOL/USD\",\"BNB/USD\",\"XRP/USD\"," +
                            "\"ADA/USD\",\"DOGE/USD\",\"TRX/USD\",\"DOT/USD\",\"LINK/USD\"," +
                            "\"AVAX/USD\",\"SHIB/USD\",\"MATIC/USD\",\"LTC/USD\",\"NEAR/USD\"" +
                            "]," +
                            "\"subscription\":{\"name\":\"ticker\"}" +
                            "}";
                    send(subscribeMessage);
                }
                @Override
                public void onMessage(String message) {
                    producer.sendToStream("Kraken", message);
                }
                @Override
                public void onClose(int code, String reason, boolean remote) {
                    System.out.println("❌ Kraken Connection Closed");
                }

                @Override
                public void onError(Exception ex) {
                    ex.printStackTrace();
                }
            };
            client.connect();
        } catch (Exception e) { e.printStackTrace(); }
    }
}
