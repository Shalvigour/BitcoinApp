package com.example.Bitcoin.controller;

import com.example.Bitcoin.model.ArbitrageOpportunity;
import com.example.Bitcoin.repository.ArbitrageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class ArbitrageHistoryController {

    @Autowired
    private ArbitrageRepository arbitrageRepository;

    @GetMapping
    public List<ArbitrageOpportunity> getHistory() {
        // MongoDB se last 20-50 entries fetch karein, timestamp ke basis par sorted
        return arbitrageRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp")).stream().limit(50).toList();
    }
}