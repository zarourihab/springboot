package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Affectation;
import com.example.suiviprojet.entities.AffectationId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AffectationRepository extends JpaRepository<Affectation, AffectationId> {
    // Recherche des affectations d'un employé
    List<Affectation> findByEmployeId(Long employeId);
}