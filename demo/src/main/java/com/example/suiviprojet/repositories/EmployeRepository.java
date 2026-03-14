package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Employe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeRepository extends JpaRepository<Employe, Long> {
    Optional<Employe> findByMatricule(String matricule);
    Optional<Employe> findByLogin(String login);
    Optional<Employe> findByEmail(String email);
    List<Employe> findByNomContainingOrPrenomContainingOrMatriculeContainingOrLoginContainingOrEmailContaining(
            String nom, String prenom, String matricule, String login, String email);
}