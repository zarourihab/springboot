package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjetRepository extends JpaRepository<Projet, Long> {

    boolean existsByCode(String code);
}