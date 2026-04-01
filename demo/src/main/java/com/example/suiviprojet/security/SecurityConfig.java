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


                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()


                        .requestMatchers("/api/auth/**").authenticated()


                        .requestMatchers(HttpMethod.POST,   "/api/employes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/employes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/employes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,    "/api/employes/**").authenticated()


                        .requestMatchers("/api/organismes/**").hasAnyRole("ADMIN", "SECRETAIRE", "DIRECTEUR")


                        .requestMatchers(HttpMethod.POST,   "/api/projets/**").hasAnyRole("ADMIN", "SECRETAIRE")
                        .requestMatchers(HttpMethod.PUT,    "/api/projets/**").hasAnyRole("ADMIN", "SECRETAIRE")
                        .requestMatchers(HttpMethod.DELETE, "/api/projets/**").hasAnyRole("ADMIN", "SECRETAIRE")
                        .requestMatchers(HttpMethod.GET,    "/api/projets/**").authenticated()


                        .requestMatchers("/api/phases/**").hasAnyRole("ADMIN", "CHEF_PROJET", "DIRECTEUR")


                        .requestMatchers("/api/affectations/**").hasAnyRole("ADMIN", "CHEF_PROJET")
                        // Les affectations imbriquées sous /phases/
                        .requestMatchers("/api/phases/*/employes/**").hasAnyRole("ADMIN", "CHEF_PROJET")
                        .requestMatchers("/api/employes/*/phases/**").authenticated()

                        .requestMatchers("/api/livrables/**").hasAnyRole("ADMIN", "CHEF_PROJET")


                        .requestMatchers("/api/documents/**").hasAnyRole("ADMIN", "CHEF_PROJET", "SECRETAIRE")


                        .requestMatchers("/api/factures/**").hasAnyRole("ADMIN", "COMPTABLE")

                        .requestMatchers("/api/phases/*/facture/**").hasAnyRole("ADMIN", "COMPTABLE")


                        .requestMatchers("/api/reporting/**").hasAnyRole("ADMIN", "DIRECTEUR", "COMPTABLE")


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