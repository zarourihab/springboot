package com.example.suiviprojet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SuiviProjetApplication {

    public static void main(String[] args) {
        System.out.println("--- TEST : Le programme se lance bien ! ---");
        SpringApplication.run(SuiviProjetApplication.class, args);
    }
}