package com.example.Bitcoin.controller;

import com.example.Bitcoin.model.ArbitrageOpportunity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ArbitragePushController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Is method ko Consumer call karega jab naya profit milega
    public void pushNewOpportunity(ArbitrageOpportunity opportunity) {
        // Destination path: /topic/arbitrage-alerts
        messagingTemplate.convertAndSend("/topic/arbitrage-alerts", opportunity);
    }
}