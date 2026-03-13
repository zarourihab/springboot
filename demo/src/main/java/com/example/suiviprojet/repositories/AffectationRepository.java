package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Affectation;
import com.example.suiviprojet.entities.AffectationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AffectationRepository extends JpaRepository<Affectation, AffectationId> {

    List<Affectation> findByEmployeId(Long employeId);

    List<Affectation> findByPhaseId(Long phaseId);

    boolean existsByEmployeIdAndPhaseId(Long employeId, Long phaseId);
}