package com.example.suiviprojet.service;

import com.example.suiviprojet.entities.Phase;
import com.example.suiviprojet.entities.Projet;
import com.example.suiviprojet.repositories.PhaseRepository;
import com.example.suiviprojet.repositories.ProjetRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportingService {

    private final PhaseRepository phaseRepository;
    private final ProjetRepository projetRepository;

    public ReportingService(PhaseRepository phaseRepository, ProjetRepository projetRepository) {
        this.phaseRepository = phaseRepository;
        this.projetRepository = projetRepository;
    }

    public List<Phase> getPhasesTermineesNonFacturees() {
        return phaseRepository.findByEtatRealisationTrueAndEtatFacturationFalse();
    }

    public List<Phase> getPhasesFactureesNonPayees() {
        return phaseRepository.findByEtatFacturationTrueAndEtatPaiementFalse();
    }

    public List<Phase> getPhasesPayees() {
        return phaseRepository.findByEtatPaiementTrue();
    }

    public List<Projet> getProjetsEnCours() {
        return projetRepository.findByDateFinAfter(LocalDate.now());
    }

    public List<Projet> getProjetsClotures() {
        return projetRepository.findByDateFinBefore(LocalDate.now());
    }

    public Map<String, Object> getTableauDeBord() {
        Map<String, Object> dashboard = new HashMap<>();

        List<Phase> termineesNonFacturees = phaseRepository.findByEtatRealisationTrueAndEtatFacturationFalse();
        List<Phase> factureesNonPayees = phaseRepository.findByEtatFacturationTrueAndEtatPaiementFalse();
        List<Phase> payees = phaseRepository.findByEtatPaiementTrue();

        List<Projet> projetsEnCours = projetRepository.findByDateFinAfter(LocalDate.now());
        List<Projet> projetsClotures = projetRepository.findByDateFinBefore(LocalDate.now());

        dashboard.put("nombrePhasesTermineesNonFacturees", termineesNonFacturees.size());
        dashboard.put("nombrePhasesFactureesNonPayees", factureesNonPayees.size());
        dashboard.put("nombrePhasesPayees", payees.size());

        dashboard.put("nombreProjetsEnCours", projetsEnCours.size());
        dashboard.put("nombreProjetsClotures", projetsClotures.size());

        dashboard.put("phasesTermineesNonFacturees", termineesNonFacturees);
        dashboard.put("phasesFactureesNonPayees", factureesNonPayees);
        dashboard.put("phasesPayees", payees);

        dashboard.put("projetsEnCours", projetsEnCours);
        dashboard.put("projetsClotures", projetsClotures);

        return dashboard;
    }
}