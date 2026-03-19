package com.example.Bitcoin.service;

import jakarta.annotation.PostConstruct;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;

@Service
public class KrakenStreamService {

    private final String KRAKEN_WS_URL  = "wss://ws.kraken.com";
    private final String KRAKEN_REST_URL =
            "https://api.kraken.com/0/public/Ticker?" +
                    "pair=XBTUSD,ETHUSD,SOLUSD,XRPUSD,ADAUSD," +
                    "DOGEUSD,TRXUSD,DOTUSD,LINKUSD,LTCUSD," +
                    "AVAXUSD,SHIBUSD,MATICUSD,NEARUSD";

    @Autowired
    private MarketDataProducer producer;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ✅ Flag — WS connected hai toh REST skip hoga
    private boolean wsConnected = false;

    @PostConstruct
    public void connect() {
        try {
            WebSocketClient client = new WebSocketClient(new URI(KRAKEN_WS_URL)) {

                @Override
                public void onOpen(ServerHandshake handshakedata) {
                    wsConnected = true; // ✅ WS live — REST band
                    System.out.println("✅ Connected to Kraken WebSocket");

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
                    wsConnected = false; // ✅ WS gaya — REST shuru ho jayega
                    System.out.println("❌ Kraken Connection Closed: " + reason);

                    // ✅ Auto reconnect — 5 seconds baad
                    new Thread(() -> {
                        try {
                            System.out.println("🔄 Kraken: Reconnecting in 5s...");
                            Thread.sleep(5000);
                            connect();
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                        }
                    }).start();
                }

                @Override
                public void onError(Exception ex) {
                    ex.printStackTrace();
                }
            };
            client.connect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ✅ REST fallback — har 5 seconds pe check karta hai
    // WS connected hai toh automatically skip ho jaata hai
    @Scheduled(fixedDelay = 5000)
    public void restFallback() {
        if (wsConnected) return; // WS chal raha hai — REST ki zaroorat nahi

        System.out.println("⚠️ Kraken WS down — REST fallback se fetch kar raha hai...");

        try {
            String response = restTemplate.getForObject(KRAKEN_REST_URL, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode result = root.path("result");

            result.fields().forEachRemaining(entry -> {
                try {
                    String krakenSymbol = entry.getKey();        // e.g. "XXBTZUSD"
                    JsonNode data       = entry.getValue();
                    String price        = data.path("c").get(0).asText(); // last trade price

                    // ✅ Kraken ke weird symbols normalize karo → BTCUSDT format
                    String symbol = krakenSymbol
                            .replace("XXBT", "BTC")   // XXBTZUSD → BTCZUSD
                            .replace("XETH", "ETH")   // XETHZUSD → ETHZUSD
                            .replace("XLTC", "LTC")
                            .replace("XXRP", "XRP")
                            .replace("XDOGE", "DOGE")
                            .replace("ZUSD", "USDT")  // ZUSD → USDT
                            .replace("USD", "USDT");   // remaining USD → USDT

                    String normalizedMsg = String.format(
                            "{\"symbol\":\"%s\",\"price\":\"%s\"}",
                            symbol, price
                    );

                    //System.out.println("💰 Kraken REST [" + symbol + "] = $" + price);
                    producer.sendToStream("Kraken", normalizedMsg);

                } catch (Exception e) {
                    System.err.println("⚠️ Kraken: Error parsing ticker: " + e.getMessage());
                }
            });

        } catch (Exception e) {
            System.err.println("⚠️ Kraken REST failed: " + e.getMessage());
        }
    }
}


//package com.example.Bitcoin.service;
//
//import jakarta.annotation.PostConstruct;
//import org.java_websocket.client.WebSocketClient;
//import org.java_websocket.handshake.ServerHandshake;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import java.net.URI;
//
//@Service
//public class KrakenStreamService {
//    private final String KRAKEN_URL = "wss://ws.kraken.com";
//
//    @Autowired
//    private MarketDataProducer producer;
//
//    @PostConstruct
//    public void connect() {
//        try {
//            WebSocketClient client = new WebSocketClient(new URI(KRAKEN_URL)) {
//                @Override
//                public void onOpen(ServerHandshake handshakedata) {
//                    System.out.println("✅ Connected to Kraken WebSocket");
//                    // Kraken uses slash (/) and USD
//                    String subscribeMessage = "{" +
//                            "\"event\":\"subscribe\"," +
//                            "\"pair\":[" +
//                            "\"BTC/USD\",\"ETH/USD\",\"SOL/USD\",\"BNB/USD\",\"XRP/USD\"," +
//                            "\"ADA/USD\",\"DOGE/USD\",\"TRX/USD\",\"DOT/USD\",\"LINK/USD\"," +
//                            "\"AVAX/USD\",\"SHIB/USD\",\"MATIC/USD\",\"LTC/USD\",\"NEAR/USD\"" +
//                            "]," +
//                            "\"subscription\":{\"name\":\"ticker\"}" +
//                            "}";
//                    send(subscribeMessage);
//                }
//                @Override
//                public void onMessage(String message) {
//                    producer.sendToStream("Kraken", message);
//                }
//                @Override
//                public void onClose(int code, String reason, boolean remote) {
//                    System.out.println("❌ Kraken Connection Closed");
//                }
//
//                @Override
//                public void onError(Exception ex) {
//                    ex.printStackTrace();
//                }
//            };
//            client.connect();
//        } catch (Exception e) { e.printStackTrace(); }
//    }
//}