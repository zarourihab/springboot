package com.example.suiviprojet.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // Endpoints publics
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/auth/forgot-password").permitAll()
                        .requestMatchers("/api/auth/reset-password").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // Endpoints authentifiés
                        .requestMatchers("/api/auth/**").authenticated()

                        // Employés
                        .requestMatchers(HttpMethod.POST,   "/api/employes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/employes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/employes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,    "/api/employes/**").authenticated()

                        // Organismes
                        .requestMatchers(HttpMethod.GET,    "/api/organismes/**").hasAnyRole("ADMIN", "SECRETAIRE", "DIRECTEUR", "CHEF_PROJET")
                        .requestMatchers(HttpMethod.POST,   "/api/organismes/**").hasAnyRole("ADMIN", "SECRETAIRE", "DIRECTEUR")
                        .requestMatchers(HttpMethod.PUT,    "/api/organismes/**").hasAnyRole("ADMIN", "SECRETAIRE", "DIRECTEUR")
                        .requestMatchers(HttpMethod.DELETE, "/api/organismes/**").hasAnyRole("ADMIN", "SECRETAIRE", "DIRECTEUR")

                        // Projets
                        .requestMatchers(HttpMethod.POST,   "/api/projets/**").hasAnyRole("ADMIN", "SECRETAIRE", "CHEF_PROJET")
                        .requestMatchers(HttpMethod.PUT,    "/api/projets/**").hasAnyRole("ADMIN", "SECRETAIRE", "CHEF_PROJET")
                        .requestMatchers(HttpMethod.DELETE, "/api/projets/**").hasAnyRole("ADMIN", "SECRETAIRE", "CHEF_PROJET")
                        .requestMatchers(HttpMethod.GET,    "/api/projets/**").authenticated()

                        // Phases
                        .requestMatchers("/api/phases/**").hasAnyRole("ADMIN", "CHEF_PROJET", "DIRECTEUR")

                        // Affectations
                        .requestMatchers("/api/phases/*/employes/**").hasAnyRole("ADMIN", "CHEF_PROJET")
                        .requestMatchers("/api/employes/*/phases/**").authenticated()

                        // Livrables
                        .requestMatchers(HttpMethod.POST, "/api/phases/*/livrables").authenticated()
                        .requestMatchers("/api/livrables/**").hasAnyRole("ADMIN", "CHEF_PROJET")

                        // Documents
                        .requestMatchers("/api/documents/**").hasAnyRole("ADMIN", "CHEF_PROJET", "SECRETAIRE")

                        // Factures
                        .requestMatchers("/api/factures/**").hasAnyRole("ADMIN", "COMPTABLE")
                        .requestMatchers("/api/phases/*/facture/**").hasAnyRole("ADMIN", "COMPTABLE")

                        // Profils
                        .requestMatchers("/api/profils/**").authenticated()

                        // Reporting
                        .requestMatchers("/api/reporting/**").hasAnyRole("ADMIN", "DIRECTEUR", "COMPTABLE", "CHEF_PROJET")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}