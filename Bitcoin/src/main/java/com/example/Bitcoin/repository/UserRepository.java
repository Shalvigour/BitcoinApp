package com.example.Bitcoin.repository;

import com.example.Bitcoin.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User,String> {
    Optional<User> findByEmailId(String emailId);
}
