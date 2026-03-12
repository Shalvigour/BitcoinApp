package com.example.Bitcoin.controller;

import com.example.Bitcoin.config.JwtUtils;
import com.example.Bitcoin.model.LoginRequest;
import com.example.Bitcoin.model.User;
import com.example.Bitcoin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    @PostMapping("/sign-up")
    public ResponseEntity<User> signUp(@RequestBody User newUser){
        try{
            newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
            newUser.setRole("ROLE_USER");
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        try{
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmailId(),request.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtUtils.generateToken(request.getEmailId());
            return new ResponseEntity<>(token,HttpStatus.OK);
        }catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Email or Password");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
        }
    }



}
