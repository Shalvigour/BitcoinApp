package com.example.Bitcoin.service;

import com.example.Bitcoin.model.User;
import com.example.Bitcoin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String emailId){
        Optional<User> optional = userRepository.findByEmailId(emailId);
        if(!optional.isPresent()){
            throw new UsernameNotFoundException("User not found with email id - "+emailId);
        }
        User user = optional.get();
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmailId())
                .password(user.getPassword())
                .authorities(user.getRole()) // Spring adds ROLE_ automatically
                .build();
    }
}
