package com.example.suiviprojet.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    private final String SECRET = "secretkeysecretkeysecretkeysecretkey";

    public String generateToken(String username, String profil){

        return Jwts.builder()
                .setSubject(username)                 // login de l'utilisateur
                .claim("profil", profil)              // on ajoute le profil dans le token
                .setIssuedAt(new Date())              // date de création
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // expire dans 24h
                .signWith(SignatureAlgorithm.HS256, SECRET.getBytes())
                .compact();
    }
}