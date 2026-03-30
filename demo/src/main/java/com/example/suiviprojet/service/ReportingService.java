package com.example.suiviprojet.service;

import com.example.suiviprojet.dto.PhaseDTO;
import com.example.suiviprojet.dto.ProjetDTO;
import com.example.suiviprojet.entities.Phase;
import com.example.suiviprojet.entities.Projet;
import com.example.suiviprojet.repositories.PhaseRepository;
import com.example.suiviprojet.repositories.ProjetRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportingService {

    private final PhaseRepository phaseRepository;
    private final ProjetRepository projetRepository;

    public ReportingService(PhaseRepository phaseRepository, ProjetRepository projetRepository) {
        this.phaseRepository = phaseRepository;
        this.projetRepository = projetRepository;
    }

    public List<PhaseDTO> getPhasesTermineesNonFacturees() {
        return phaseRepository.findByEtatRealisationTrueAndEtatFacturationFalse()
                .stream().map(this::mapPhaseToDto).collect(Collectors.toList());
    }

    public List<PhaseDTO> getPhasesFactureesNonPayees() {
        return phaseRepository.findByEtatFacturationTrueAndEtatPaiementFalse()
                .stream().map(this::mapPhaseToDto).collect(Collectors.toList());
    }

    public List<PhaseDTO> getPhasesPayees() {
        return phaseRepository.findByEtatPaiementTrue()
                .stream().map(this::mapPhaseToDto).collect(Collectors.toList());
    }

    public List<ProjetDTO> getProjetsEnCours() {
        return projetRepository.findByDateFinAfter(LocalDate.now())
                .stream().map(this::mapProjetToDto).collect(Collectors.toList());
    }

    public List<ProjetDTO> getProjetsClotures() {
        return projetRepository.findByDateFinBefore(LocalDate.now())
                .stream().map(this::mapProjetToDto).collect(Collectors.toList());
    }

    public Map<String, Object> getTableauDeBord() {
        Map<String, Object> dashboard = new HashMap<>();

        List<PhaseDTO> termineesNonFacturees = getPhasesTermineesNonFacturees();
        List<PhaseDTO> factureesNonPayees = getPhasesFactureesNonPayees();
        List<PhaseDTO> payees = getPhasesPayees();
        List<ProjetDTO> projetsEnCours = getProjetsEnCours();
        List<ProjetDTO> projetsClotures = getProjetsClotures();

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

    private PhaseDTO mapPhaseToDto(Phase phase) {
        PhaseDTO dto = new PhaseDTO();
        dto.id = phase.getId();
        dto.code = phase.getCode();
        dto.libelle = phase.getLibelle();
        dto.description = phase.getDescription();
        dto.dateDebut = phase.getDateDebut();
        dto.dateFin = phase.getDateFin();
        dto.montant = phase.getMontant();
        dto.etatRealisation = phase.isEtatRealisation();
        dto.etatFacturation = phase.isEtatFacturation();
        dto.etatPaiement = phase.isEtatPaiement();
        if (phase.getProjet() != null) {
            dto.projetId = phase.getProjet().getId();
        }
        return dto;
    }

    private ProjetDTO mapProjetToDto(Projet projet) {
        ProjetDTO dto = new ProjetDTO();
        dto.setId(projet.getId());
        dto.setCode(projet.getCode());
        dto.setNom(projet.getNom());
        dto.setDescription(projet.getDescription());
        dto.setDateDebut(projet.getDateDebut());
        dto.setDateFin(projet.getDateFin());
        dto.setMontant(projet.getMontant());
        if (projet.getOrganisme() != null) dto.setOrganismeId(projet.getOrganisme().getId());
        if (projet.getChefProjet() != null) dto.setChefProjetId(projet.getChefProjet().getId());
        return dto;
    }
}
