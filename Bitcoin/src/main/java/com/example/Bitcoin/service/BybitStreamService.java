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

                    String subMsg1 = "{\"op\": \"subscribe\", \"args\": [" +
                            "\"tickers.BTCUSDT\"," +
                            "\"tickers.ETHUSDT\"," +
                            "\"tickers.SOLUSDT\"," +
                            "\"tickers.BNBUSDT\"," +
                            "\"tickers.XRPUSDT\"," +
                            "\"tickers.ADAUSDT\"," +
                            "\"tickers.DOGEUSDT\"," +
                            "\"tickers.TRXUSDT\"," +
                            "\"tickers.DOTUSDT\"," +
                            "\"tickers.LINKUSDT\"" +
                            "]}";

                    // ✅ Batch 2 — baaki 5 coins
                    String subMsg2 = "{\"op\": \"subscribe\", \"args\": [" +
                            "\"tickers.AVAXUSDT\"," +
                            "\"tickers.SHIBUSDT\"," +
                            "\"tickers.MATICUSDT\"," +
                            "\"tickers.LTCUSDT\"," +
                            "\"tickers.NEARUSDT\"" +
                            "]}";

                    send(subMsg1);
                    send(subMsg2);
                }

                @Override
                public void onMessage(String message) {
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
