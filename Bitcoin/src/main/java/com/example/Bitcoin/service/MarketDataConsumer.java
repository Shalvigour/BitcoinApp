package com.example.Bitcoin.service;

import com.example.Bitcoin.controller.ArbitragePushController;
import com.example.Bitcoin.model.ArbitrageOpportunity;
import com.example.Bitcoin.repository.ArbitrageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.stream.StreamListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class MarketDataConsumer implements StreamListener<String, MapRecord<String, String, String>> {



    // PRO LOGIC: Memory mein latest prices store karne ke liye
    // Structure: <CoinName, <ExchangeName, Price>>
    // Example: <"BTC", <"Binance", 65000.0>>
    @Autowired
    private ArbitrageRepository arbitrageRepository; // MongoDB

    @Autowired
    private ArbitragePushController pushController;

    public static final ConcurrentHashMap<String, Map<String, Double>> latestPrices = new ConcurrentHashMap<>();

    @Override
    public void onMessage(MapRecord<String, String, String> message) {
        Map<String, String> body = message.getValue();

        String priceStr = body.get("price");
        String symbolStr = body.get("symbol");

        // 1. Check if price or symbol is null OR empty string
        if (priceStr == null || priceStr.trim().isEmpty() ||
                symbolStr == null || symbolStr.trim().isEmpty()) {
            // System.out.println("⚠️ Skipping empty record from: " + body.get("exchange"));
            return;
        }

        try {
            String exchange = body.get("exchange");
            String coin = symbolStr;
            double price = Double.parseDouble(priceStr); // Ab crash nahi hoga

            latestPrices.computeIfAbsent(coin, k -> new ConcurrentHashMap<>()).put(exchange, price);
            calculateArbitrage(coin);

        } catch (NumberFormatException e) {
            System.err.println("🚨 Invalid price format: " + priceStr + " from " + body.get("exchange"));
        }
    }

    private void calculateArbitrage(String coin) {
        Map<String, Double> prices = latestPrices.get(coin);
        if (prices.size() < 2) return;

        // Finding Max and Min
        String maxEx = prices.entrySet().stream().max(Map.Entry.comparingByValue()).get().getKey();
        double sellPrice = prices.get(maxEx);

        String minEx = prices.entrySet().stream().min(Map.Entry.comparingByValue()).get().getKey();
        double buyPrice = prices.get(minEx);

        // --- REAL WORLD CALCULATION ---
        double tradingFeePercent = 0.002; // 0.2% total (0.1% Buy + 0.1% Sell)
        // Note: WazirX price already USDT mein hai, toh sirf TDS logic check karna hai
        double tdsPercent = (maxEx.equals("WazirX")) ? 0.01 : 0;

        double totalFees = (buyPrice * 0.001) + (sellPrice * 0.001) + (sellPrice * tdsPercent);
        double netProfit = (sellPrice - buyPrice) - totalFees;
        double profitPercentage = (netProfit / buyPrice) * 100;

        // Hum sirf tab save karenge jab profit 0.05% se zyada ho (taaki junk data na bhare)
        if (profitPercentage > 0.05) {
            saveAndPushOpportunity(coin, minEx, maxEx, buyPrice, sellPrice, netProfit, profitPercentage);
        }
    }

    private void saveAndPushOpportunity(String coin, String buyEx, String sellEx, double bPrice, double sPrice, double profit, double percent) {
        ArbitrageOpportunity opportunity = new ArbitrageOpportunity();
        opportunity.setCoin(coin);
        // ... set other fields same as yours ...
        opportunity.setTimestamp(LocalDateTime.now());

        // 1. Save to MongoDB (Persistent History)
        arbitrageRepository.save(opportunity);

        // 2. Push via WebSocket (Instant Screen Update)
        pushController.pushNewOpportunity(opportunity);
    }


    private void saveOpportunityToDB(String coin, String buyEx, String sellEx, double bPrice, double sPrice, double profit, double percent) {
        ArbitrageOpportunity opportunity = new ArbitrageOpportunity();
        opportunity.setCoin(coin);
        opportunity.setBuyExchange(buyEx);
        opportunity.setSellExchange(sellEx);
        opportunity.setBuyPrice(bPrice);
        opportunity.setSellPrice(sPrice);
        opportunity.setNetProfit(profit);
        opportunity.setProfitPercentage(percent);
        opportunity.setTimestamp(LocalDateTime.now());

        arbitrageRepository.save(opportunity);
    }
}
