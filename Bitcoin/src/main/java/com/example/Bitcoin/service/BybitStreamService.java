package com.example.Bitcoin.service;


import jakarta.annotation.PostConstruct;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.util.Timer;
import java.util.TimerTask;


@Service
public class BybitStreamService {
    private final String BYBIT_URL = "wss://stream.bybit.com/v5/public/spot";

    @Autowired
    private MarketDataProducer producer;

    @PostConstruct
    public void connect() {
        try {
            WebSocketClient client = new WebSocketClient(new URI(BYBIT_URL)) {
                @Override
                public void onOpen(ServerHandshake handshakedata) {
                    System.out.println("✅ Connected to Bybit WebSocket");
                    String subscribeMessage = "{" +
                            "\"op\": \"subscribe\"," +
                            "\"args\": [" +
                            "\"ticker.BTCUSDT\",\"ticker.ETHUSDT\",\"ticker.SOLUSDT\",\"ticker.BNBUSDT\"," +
                            "\"ticker.XRPUSDT\",\"ticker.ADAUSDT\",\"ticker.DOGEUSDT\",\"ticker.TRXUSDT\"," +
                            "\"ticker.DOTUSDT\",\"ticker.LINKUSDT\",\"ticker.AVAXUSDT\",\"ticker.SHIBUSDT\"," +
                            "\"ticker.MATICUSDT\",\"ticker.LTCUSDT\",\"ticker.NEARUSDT\"" +
                            "]" +
                            "}";
                    send(subscribeMessage);

                    new Timer().scheduleAtFixedRate(new TimerTask() {
                        @Override
                        public void run() {
                            if (isOpen()) {
                                send("{\"op\":\"ping\"}");
                            }
                        }
                    }, 20000, 20000);
                }
                @Override
                public void onMessage(String message) {
                    if (message.contains("ret_msg\":\"pong\"") || message.contains("success\":true")) {
                        return;
                    }
                    producer.sendToStream("Bybit", message);
                }
                @Override
                public void onClose(int code, String reason, boolean remote) {
                    System.out.println("❌ Bybit Connection Closed");
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
