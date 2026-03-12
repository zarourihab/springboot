package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Employe;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmployeRepository extends JpaRepository<Employe, Long> {
    // Méthodes métier demandées
    Optional<Employe> findByMatricule(String matricule);
    Optional<Employe> findByLogin(String login);
}