package com.example.Bitcoin.controller;

import com.example.Bitcoin.model.User;
import com.example.Bitcoin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RequestMapping("/admin")
@RestController
public class AdminController {

    @Autowired
    private UserService userService;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @GetMapping("/all-users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        List<User> listOfUsers = userService.findAll();
        return new ResponseEntity<>(listOfUsers, HttpStatus.OK);
    }

    @PostMapping("/create-admin")
    public ResponseEntity<User> newAdmin(@RequestBody User newUser){
        try{
            newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
            newUser.setRole("ROLE_ADMIN");
            Boolean check = userService.signUp(newUser);
            if(check==true){
                Optional<User> optional = userService.findByUsername(newUser.getEmailId());
                if(optional.isPresent()){
                    return new ResponseEntity<>(optional.get(),HttpStatus.OK);
                }
                return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
            }
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
