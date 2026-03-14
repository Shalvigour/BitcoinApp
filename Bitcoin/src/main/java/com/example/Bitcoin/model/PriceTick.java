package com.example.Bitcoin.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class PriceTick {
    private String symbol;   // BTCUSDT
    private double price;    // 65000.50
    private String exchange; // Binance or Coinbase
}



