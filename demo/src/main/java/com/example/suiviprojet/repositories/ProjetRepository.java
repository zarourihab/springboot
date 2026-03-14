package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjetRepository extends JpaRepository<Projet, Long> {

    boolean existsByCode(String code);

    Optional<Projet> findByCode(String code);

    List<Projet> findByNomContainingOrCodeContaining(String nom, String code);

    List<Projet> findByDateFinAfter(LocalDate date);

    List<Projet> findByDateFinBefore(LocalDate date);
}