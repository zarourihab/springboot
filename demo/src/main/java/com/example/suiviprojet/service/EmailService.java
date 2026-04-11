package com.example.suiviprojet.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendResetPasswordEmail(String toEmail, String token) {
        String resetLink = "http://localhost/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Réinitialisation de votre mot de passe — Suivi Projet");
        message.setText(
                "Bonjour,\n\n" +
                        "Vous avez demandé la réinitialisation de votre mot de passe.\n\n" +
                        "Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :\n" +
                        resetLink + "\n\n" +
                        "Ce lien est valable pendant 30 minutes.\n\n" +
                        "Si vous n'avez pas fait cette demande, ignorez cet email.\n\n" +
                        "— L'équipe Suivi Projet"
        );

        mailSender.send(message);
    }
}