package com.example.Bitcoin.service;

import com.example.Bitcoin.model.User;
import com.example.Bitcoin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public boolean signUp(User newUser){
        try{
            userRepository.save(newUser);
            return true;
        }catch(Exception e){
            return false;
        }
    }

    public Optional<User> findByUsername(String emailId){
        Optional<User> optional= userRepository.findByEmailId(emailId);
        return optional;
    }

    public List<User> findAll(){
        return userRepository.findAll();
    }
}
