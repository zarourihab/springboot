package com.example.suiviprojet.service;

import com.example.suiviprojet.dto.PhaseDTO;
import com.example.suiviprojet.entities.Phase;
import com.example.suiviprojet.entities.Projet;
import com.example.suiviprojet.repositories.PhaseRepository;
import com.example.suiviprojet.repositories.ProjetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PhaseService {

    private final PhaseRepository phaseRepository;
    private final ProjetRepository projetRepository;

    public PhaseService(PhaseRepository phaseRepository, ProjetRepository projetRepository) {
        this.phaseRepository = phaseRepository;
        this.projetRepository = projetRepository;
    }

    // Créer une phase
    public PhaseDTO create(PhaseDTO dto) {

        Phase phase = new Phase();

        phase.setCode(dto.code);
        phase.setLibelle(dto.libelle);
        phase.setDescription(dto.description);
        phase.setDateDebut(dto.dateDebut);
        phase.setDateFin(dto.dateFin);
        phase.setMontant(dto.montant);
        phase.setEtatRealisation(dto.etatRealisation);
        phase.setEtatFacturation(dto.etatFacturation);
        phase.setEtatPaiement(dto.etatPaiement);

        Projet projet = projetRepository.findById(dto.projetId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));

        phase.setProjet(projet);

        phase = phaseRepository.save(phase);

        dto.id = phase.getId();

        return dto;
    }

    // Trouver une phase par ID
    public PhaseDTO findById(Long id) {

        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Phase non trouvée"));

        return convertToDTO(phase);
    }

    // Liste de toutes les phases
    public List<PhaseDTO> findAll() {

        return phaseRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Phases d’un projet
    public List<PhaseDTO> findByProjet(Long projetId) {

        return phaseRepository.findByProjetId(projetId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Modifier une phase
    public PhaseDTO update(Long id, PhaseDTO dto) {

        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Phase non trouvée"));

        phase.setCode(dto.code);
        phase.setLibelle(dto.libelle);
        phase.setDescription(dto.description);
        phase.setDateDebut(dto.dateDebut);
        phase.setDateFin(dto.dateFin);
        phase.setMontant(dto.montant);
        phase.setEtatRealisation(dto.etatRealisation);
        phase.setEtatFacturation(dto.etatFacturation);
        phase.setEtatPaiement(dto.etatPaiement);

        phaseRepository.save(phase);

        return convertToDTO(phase);
    }

    // Supprimer une phase
    public void delete(Long id) {
        phaseRepository.deleteById(id);
    }

    // Conversion Entity → DTO
    private PhaseDTO convertToDTO(Phase phase) {

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
}