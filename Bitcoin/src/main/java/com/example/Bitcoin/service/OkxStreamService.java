//package com.example.Bitcoin.service;
//
//import jakarta.annotation.PostConstruct;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//
//import java.util.List;
//
//@Service
//public class OkxStreamService {
//
//    // ✅ REST API — port 443, college network pe kaam karta hai
//    private static final String OKX_URL =
//            "https://www.okx.com/api/v5/market/tickers?instType=SPOT";
//
//    private static final List<String> DESIRED = List.of(
//            "BTC-USDT","ETH-USDT","SOL-USDT","BNB-USDT","XRP-USDT",
//            "ADA-USDT","DOGE-USDT","TRX-USDT","DOT-USDT","LINK-USDT",
//            "AVAX-USDT","SHIB-USDT","LTC-USDT","NEAR-USDT","MATIC-USDT"
//    );
//
//    @Autowired
//    private MarketDataProducer producer;
//
//    private final RestTemplate restTemplate = new RestTemplate();
//    private final ObjectMapper objectMapper = new ObjectMapper();
//
//    @PostConstruct
//    public void init() {
//        System.out.println("✅ OKX: REST polling started");
//    }
//
//    @Scheduled(fixedDelay = 3000)
//    public void fetchTickers() {
//        try {
//            String response = restTemplate.getForObject(OKX_URL, String.class);
//            JsonNode root = objectMapper.readTree(response);
//            JsonNode dataArray = root.path("data"); // array of all coins
//
//            for (JsonNode ticker : dataArray) {
//                String instId = ticker.path("instId").asText(); // "BTC-USDT"
//                if (!DESIRED.contains(instId)) continue;
//
//                String price = ticker.path("last").asText(); // last price
//
//                // Producer ke OKX case ke liye same format
//                String normalizedMsg = String.format(
//                        "{\"data\":[{\"instId\":\"%s\",\"last\":\"%s\"}]}",
//                        instId, price
//                );
//
//                System.out.println("💰 OKX [" + instId + "] = $" + price);
//                producer.sendToStream("OKX", normalizedMsg);
//            }
//
//        } catch (Exception e) {
//            System.err.println("⚠️ OKX fetch failed: " + e.getMessage());
//        }
//    }
//}