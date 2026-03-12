package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PhaseRepository extends JpaRepository<Phase, Long> {
    // Recherche des phases d'un projet
    List<Phase> findByProjetId(Long projetId);

    // Recherche phases terminées non facturées
    List<Phase> findByEtatRealisationTrueAndEtatFacturationFalse();

    // Recherche phases facturées non payées
    List<Phase> findByEtatFacturationTrueAndEtatPaiementFalse();
}

