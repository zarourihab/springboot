package com.example.suiviprojet.service;

import com.example.suiviprojet.entities.Phase;
import com.example.suiviprojet.repositories.PhaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportingService {

    private final PhaseRepository phaseRepository;

    public ReportingService(PhaseRepository phaseRepository) {
        this.phaseRepository = phaseRepository;
    }

    public List<Phase> phasesTermineesNonFacturees() {
        return phaseRepository.findByEtatRealisationTrueAndEtatFacturationFalse();
    }

    public List<Phase> phasesFactureesNonPayees() {
        return phaseRepository.findByEtatFacturationTrueAndEtatPaiementFalse();
    }

    public List<Phase> phasesPayees() {
        return phaseRepository.findByEtatPaiementTrue();
    }
}