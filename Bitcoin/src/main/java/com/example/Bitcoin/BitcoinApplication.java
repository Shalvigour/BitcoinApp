package com.example.Bitcoin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BitcoinApplication {

	public static void main(String[] args) {

		SpringApplication.run(BitcoinApplication.class, args);

	}

}
