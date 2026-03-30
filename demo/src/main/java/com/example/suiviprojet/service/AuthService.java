package com.example.suiviprojet.service;

import com.example.suiviprojet.entities.Employe;
import com.example.suiviprojet.repositories.EmployeRepository;
import com.example.suiviprojet.security.JwtService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final EmployeRepository employeRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(EmployeRepository employeRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this.employeRepository = employeRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public String login(String login, String password) {
        Employe emp = employeRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!passwordEncoder.matches(password, emp.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        return jwtService.generateToken(emp.getLogin(), emp.getProfil().getCode());
    }

    public void changePassword(String oldPassword, String newPassword) {

        String loginConnecte = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Employe emp = employeRepository.findByLogin(loginConnecte)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!passwordEncoder.matches(oldPassword, emp.getPassword())) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }

        emp.setPassword(passwordEncoder.encode(newPassword));
        employeRepository.save(emp);
    }
}