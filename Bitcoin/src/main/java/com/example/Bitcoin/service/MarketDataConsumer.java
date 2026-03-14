package com.example.Bitcoin.service;

import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.stream.StreamListener;
import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class MarketDataConsumer implements StreamListener<String, MapRecord<String, String, String>> {

    // PRO LOGIC: Memory mein latest prices store karne ke liye
    // Structure: <CoinName, <ExchangeName, Price>>
    // Example: <"BTC", <"Binance", 65000.0>>
    public static final ConcurrentHashMap<String, Map<String, Double>> latestPrices = new ConcurrentHashMap<>();

    @Override
    public void onMessage(MapRecord<String, String, String> message) {
        Map<String, String> body = message.getValue();

        // 1. Safety Check
        if (body.get("price") == null || body.get("symbol") == null || body.get("price").trim().isEmpty()) {
            return;
        }

        String exchange = body.get("exchange");
        String coin = body.get("symbol");
        double price = Double.parseDouble(body.get("price"));

        // 2. Map mein data store karna (VVIP Step)
        // computeIfAbsent check karta hai ki agar us coin ka map nahi bana toh bana de
        latestPrices.computeIfAbsent(coin, k -> new ConcurrentHashMap<>()).put(exchange, price);

        // 3. Calculation function ko call karna
        calculateArbitrage(coin);
    }

    private void calculateArbitrage(String coin) {
        Map<String, Double> prices = latestPrices.get(coin);
        if (prices.size() < 2) return; // Kam se kam 2 exchanges chahiye compare karne ke liye

        // Max aur Min dhoondna
        String maxExchange = prices.entrySet().stream().max(Map.Entry.comparingByValue()).get().getKey();
        double maxPrice = prices.get(maxExchange);

        String minExchange = prices.entrySet().stream().min(Map.Entry.comparingByValue()).get().getKey();
        double minPrice = prices.get(minExchange);

        // Display logic (Abhi ke liye console par, baad mein UI par)
        System.out.println("💎 Coin: " + coin + " | High: " + maxPrice + " (" + maxExchange + ") | Low: " + minPrice + " (" + minExchange + ")");

        // Profit Logic (Fees minus karke)
        double diff = maxPrice - minPrice;
        if (diff > 0) {
            // Yahan hum apna main algorithm lagayenge (Step 5)
            System.out.println("🚀 Potential Profit for " + coin + ": " + diff);
        }
    }
}
