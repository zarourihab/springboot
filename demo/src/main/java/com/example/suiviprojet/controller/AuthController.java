package com.example.suiviprojet.controller;

import com.example.suiviprojet.dto.ChangePasswordRequest;
import com.example.suiviprojet.dto.LoginRequest;
import com.example.suiviprojet.dto.LoginResponse;
import com.example.suiviprojet.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        String token = authService.login(request.login, request.password);
        return new LoginResponse(token);
    }

    @GetMapping("/me")
    public String me(Authentication authentication) {
        return authentication.getName();
    }

    @PostMapping("/change-password")
    public void changePassword(@RequestBody ChangePasswordRequest request) {
        authService.changePassword(request.oldPassword, request.newPassword);
    }

    // Mot de passe oublié — envoie un email
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        authService.forgotPassword(email);
        return ResponseEntity.ok(Map.of("message", "Un email de réinitialisation a été envoyé à " + email));
    }

    // Réinitialisation avec le token reçu par mail
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok(Map.of("message", "Mot de passe réinitialisé avec succès"));
    }
}