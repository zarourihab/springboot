package com.example.suiviprojet.service;

import com.example.suiviprojet.entities.Employe;
import com.example.suiviprojet.entities.ResetToken;
import com.example.suiviprojet.exceptions.BusinessException;
import com.example.suiviprojet.exceptions.ResourceNotFoundException;
import com.example.suiviprojet.repositories.EmployeRepository;
import com.example.suiviprojet.repositories.ResetTokenRepository;
import com.example.suiviprojet.security.JwtService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final EmployeRepository employeRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final ResetTokenRepository resetTokenRepository;
    private final EmailService emailService;

    public AuthService(EmployeRepository employeRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder,
                       ResetTokenRepository resetTokenRepository,
                       EmailService emailService) {
        this.employeRepository = employeRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.resetTokenRepository = resetTokenRepository;
        this.emailService = emailService;
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
                .getAuthentication().getName();

        Employe emp = employeRepository.findByLogin(loginConnecte)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        if (!passwordEncoder.matches(oldPassword, emp.getPassword())) {
            throw new BusinessException("Ancien mot de passe incorrect");
        }

        emp.setPassword(passwordEncoder.encode(newPassword));
        employeRepository.save(emp);
    }

    @Transactional
    public void forgotPassword(String email) {
        // Vérifie que l'email existe
        employeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Aucun compte trouvé avec cet email"));

        // Supprime les anciens tokens pour cet email
        resetTokenRepository.deleteByEmail(email);

        // Génère un nouveau token
        String token = UUID.randomUUID().toString();
        ResetToken resetToken = new ResetToken(token, email, LocalDateTime.now().plusMinutes(30));
        resetTokenRepository.save(resetToken);

        // Envoie l'email
        emailService.sendResetPasswordEmail(email, token);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        ResetToken resetToken = resetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BusinessException("Lien de réinitialisation invalide"));

        if (resetToken.isUsed()) {
            throw new BusinessException("Ce lien a déjà été utilisé");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Ce lien a expiré. Veuillez refaire une demande.");
        }

        Employe emp = employeRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        emp.setPassword(passwordEncoder.encode(newPassword));
        employeRepository.save(emp);

        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);
    }
}