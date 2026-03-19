package com.example.Bitcoin.repository;

import com.example.Bitcoin.model.ArbitrageOpportunity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ArbitrageRepository extends MongoRepository<ArbitrageOpportunity, String> {
}
