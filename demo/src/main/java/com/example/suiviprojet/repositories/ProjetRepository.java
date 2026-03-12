package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProjetRepository extends JpaRepository<Projet, Long> {
    Optional<Projet> findByCode(String code);
}