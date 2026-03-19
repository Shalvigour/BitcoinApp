package com.example.Bitcoin.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@Service
public class WazirXStreamService {

    // ✅ Single endpoint — returns ALL tickers in one call, no 429
    private static final String ALL_TICKERS_URL =
            "https://api.wazirx.com/sapi/v1/tickers/24hr";

    private static final List<String> DESIRED_COINS =
            List.of("btc", "eth", "bnb", "xrp", "sol",
                    "ada", "doge", "trx", "dot", "link",
                    "avax", "shib", "ltc");

    @Autowired
    private MarketDataProducer producer;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private double usdtInrRate = 0.0;

    @PostConstruct
    public void init() {
        System.out.println("✅ WazirX: REST polling started");
    }

    // ✅ One single call every 2 seconds — fetches ALL tickers at once
    @Scheduled(fixedDelay = 2000)
    public void fetchAllTickers() {
        try {
            String response = restTemplate.getForObject(ALL_TICKERS_URL, String.class);
            JsonNode tickersArray = objectMapper.readTree(response);

            // Step 1: Find usdtinr rate first from the array
            for (JsonNode ticker : tickersArray) {
                if ("usdtinr".equals(ticker.path("symbol").asText())) {
                    double rate = ticker.path("lastPrice").asDouble();
                    if (rate > 0) {
                        usdtInrRate = rate;
                        System.out.println("💱 USDT/INR Rate: ₹" + usdtInrRate);
                    }
                    break;
                }
            }

            if (usdtInrRate <= 0) {
                System.out.println("⏳ WazirX: Waiting for USDT/INR rate...");
                return;
            }

            // Step 2: Filter desired coins, convert INR → USDT
            for (JsonNode ticker : tickersArray) {
                String symbol = ticker.path("symbol").asText(); // e.g. "btcinr"

                if (!symbol.endsWith("inr") || symbol.equals("usdtinr")) continue;

                String coin = symbol.replace("inr", ""); // "btc"
                if (!DESIRED_COINS.contains(coin)) continue;

                double priceInr  = ticker.path("lastPrice").asDouble();
                double priceUsdt = priceInr / usdtInrRate;

                String normalizedMsg = String.format(
                        "{\"symbol\":\"%sUSDT\",\"price\":\"%.6f\"}",
                        coin.toUpperCase(), priceUsdt
                );

                //System.out.println("💰 WazirX [" + coin.toUpperCase() + "/USDT] = $"
                //+ String.format("%.4f", priceUsdt));

                producer.sendToStream("WazirX", normalizedMsg);
            }

        } catch (Exception e) {
            System.err.println("⚠️ WazirX fetch failed: " + e.getMessage());
        }
    }
}