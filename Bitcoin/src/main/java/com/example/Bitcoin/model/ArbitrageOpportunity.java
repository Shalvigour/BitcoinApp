package com.example.Bitcoin.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "arbitrage_history")
@Data
public class ArbitrageOpportunity {
    @Id
    private String id;
    private String coin;
    private String buyExchange;
    private String sellExchange;
    private double buyPrice;
    private double sellPrice;
    private double netProfit;
    private double profitPercentage;
    private LocalDateTime timestamp;
}
