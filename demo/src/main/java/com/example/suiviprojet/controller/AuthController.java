package com.example.suiviprojet.controller;

import com.example.suiviprojet.dto.ChangePasswordRequest;
import com.example.suiviprojet.dto.LoginRequest;
import com.example.suiviprojet.dto.LoginResponse;
import com.example.suiviprojet.service.AuthService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){

        String token = authService.login(
                request.login,
                request.password
        );

        return new LoginResponse(token);
    }

    @GetMapping("/me")
    public String me(Authentication authentication){

        return authentication.getName();

    }

    @PostMapping("/change-password")
    public void changePassword(@RequestBody ChangePasswordRequest request) {

        authService.changePassword(
                request.oldPassword,
                request.newPassword
        );

    }
}