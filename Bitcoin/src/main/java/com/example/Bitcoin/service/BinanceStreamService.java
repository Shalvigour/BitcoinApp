package com.example.Bitcoin.service;

import jakarta.annotation.PostConstruct;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.net.URI;

@Service
public class BinanceStreamService {

    private final String BINANCE_URL = "wss://stream.binance.com:9443/stream?streams=" +
            "btcusdt@trade/ethusdt@trade/solusdt@trade/bnbusdt@trade/xrpusdt@trade/" +
            "adausdt@trade/dogeusdt@trade/trxusdt@trade/dotusdt@trade/linkusdt@trade/" +
            "avaxusdt@trade/shibusdt@trade/maticusdt@trade/ltcusdt@trade/nearusdt@trade";

    @Autowired
    private MarketDataProducer producer;

    @PostConstruct
    public void connect() {
        try {
            WebSocketClient client = new WebSocketClient(new URI(BINANCE_URL)) {
                @Override
                public void onMessage(String message) {
                    // Binance se JSON aata hai, hum sirf price aur symbol nikalenge
                    // Simple logic for now: parse JSON and send to Producer
                    producer.sendToStream("Binance", message);
                }

                @Override
                public void onOpen(ServerHandshake handshakedata) {
                    System.out.println("✅ Connected to Binance WebSocket");
                }

                @Override public void onClose(int code, String reason, boolean remote) {}
                @Override public void onError(Exception ex) { ex.printStackTrace(); }
            };
            client.connect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
