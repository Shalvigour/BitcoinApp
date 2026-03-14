package com.example.Bitcoin.service;

import jakarta.annotation.PostConstruct;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;


@Service
public class OkxStreamService {
    private final String OKX_URL = "wss://ws.okx.com:8443/ws/v5/public";

    @Autowired
    private MarketDataProducer producer;

    @PostConstruct
    public void connect() {
        try {
            Map<String, String> headers = new HashMap<>();
            headers.put("User-Agent", "Mozilla/5.0");
            WebSocketClient client = new WebSocketClient(new URI(OKX_URL)) {
                @Override
                public void onOpen(ServerHandshake handshakedata) {
                    System.out.println("✅ Connected to Okx WebSocket");
                    String subscribeMessage = "{" +
                            "\"op\": \"subscribe\"," +
                            "\"args\": [" +
                            "{\"channel\": \"tickers\", \"instId\": \"BTC-USDT\"}," +
                            "{\"channel\": \"tickers\", \"instId\": \"ETH-USDT\"}," +
                            "{\"channel\": \"tickers\", \"instId\": \"SOL-USDT\"}," +
                            "{\"channel\": \"tickers\", \"instId\": \"BNB-USDT\"}," +
                            "{\"channel\": \"tickers\", \"instId\": \"XRP-USDT\"}," +
                            "{\"channel\": \"tickers\", \"instId\": \"ADA-USDT\"}," +
                            "{\"channel\": \"tickers\", \"instId\": \"DOGE-USDT\"}," +
                            "{\"channel\": \"tickers\", \"instId\": \"TRX-USDT\"}," +
                            "{\"channel\": \"tickers\", \"instId\": \"DOT-USDT\"}," +
                            "{\"channel\": \"tickers\", \"instId\": \"LINK-USDT\"}" +
                            // Aap isi tarah 15 tak list badha sakte hain
                            "]" +
                            "}";
                    send(subscribeMessage);
                    new Timer().scheduleAtFixedRate(new TimerTask() {
                        @Override
                        public void run() {
                            if (isOpen()) {
                                send("ping");
                            }
                        }
                    }, 15000, 15000);
                }
                @Override
                public void onMessage(String message) {
                    if (message.equals("pong")) return;
                    producer.sendToStream("OKX", message);
                }
                @Override
                public void onClose(int code, String reason, boolean remote) {
                    System.out.println("❌ Okx Connection Closed");
                }

                @Override
                public void onError(Exception ex) {
                    ex.printStackTrace();
                }
            };
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, new TrustManager[]{new X509TrustManager() {
                public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                public java.security.cert.X509Certificate[] getAcceptedIssuers() { return null; }
            }}, new java.security.SecureRandom());

            client.setConnectionLostTimeout(30);
            client.setSocketFactory(sslContext.getSocketFactory());
            client.connect();
        } catch (Exception e) { e.printStackTrace(); }
    }
}
