package com.example.Bitcoin.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class MarketDataProducer {

    @Autowired
    private StringRedisTemplate redisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper(); // JSON parse karne ke liye

    public void sendToStream(String exchangeName, String rawData) {
        try {
            JsonNode jsonNode = objectMapper.readTree(rawData);
            Map<String, String> dataMap = new HashMap<>();

            String symbol = "";
            String price = "";
            if (price == null || price.isEmpty() || symbol == null || symbol.isEmpty()) {
                return; // Don't push to Redis if data is missing
            }
            switch (exchangeName) {
                case "Binance":
                    symbol = jsonNode.has("data") ? jsonNode.get("data").get("s").asText() : jsonNode.get("s").asText();
                    price = jsonNode.has("data") ? jsonNode.get("data").get("p").asText() : jsonNode.get("p").asText();
                    break;
                case "Coinbase":
                    symbol = jsonNode.get("product_id").asText();
                    price = jsonNode.get("price").asText();
                    break;
                case "Kraken":
                    // Kraken sends price in the 1st index of an array usually
                    if (jsonNode.isArray()) {
                        price = jsonNode.get(1).get("c").get(0).asText();
                        symbol = jsonNode.get(3).asText();
                    }
                    break;
                case "Bybit":
                    // Bybit sends a "topic" and "data" object
                    if (jsonNode.has("data") && jsonNode.get("data").has("lastPrice")) {
                        // Bybit data is an object, not an array in V5 Tickers
                        price = jsonNode.get("data").get("lastPrice").asText();
                        symbol = jsonNode.get("data").get("symbol").asText();
                    } else {
                        // Agar lastPrice nahi hai (matlab ye welcome message hai), toh skip karo
                        return;
                    }
                    break;
//                case "OKX":
//                    // OKX sends data in a 'data' array
//                    if (jsonNode.has("data")) {
//                        symbol = jsonNode.get("data").get(0).get("instId").asText();
//                        price = jsonNode.get("data").get(0).get("last").asText();
//                    }
//                    break;
                case "WazirX":
                    symbol = jsonNode.get("symbol").asText();
                    price  = jsonNode.get("price").asText();
                    break;
            }
            // Symbols ko normalize karna: BTCUSDT aur BTC-USD dono ban jayenge BTC
            String normalizedSymbol = symbol.replace("USDT", "")
                    .replace("USD", "")
                    .replace("-", "")
                    .replace("/", "")
                    .replace("_", "")
                    .toUpperCase()
                    .trim();
            dataMap.put("symbol", normalizedSymbol);

            dataMap.put("exchange", exchangeName);
            dataMap.put("price", price);

            redisTemplate.opsForStream().add("market-ticks", dataMap);

        } catch (Exception e) {
            // Kabhi kabhi initial messages (like subscription confirm) mein price nahi hota
            // Unhe skip karne ke liye ye catch block zaroori hai
            System.out.println("Skipping non-price message from " + exchangeName);
        }
    }
}