package com.example.suiviprojet.service;

import com.example.suiviprojet.dto.PhaseDTO;
import com.example.suiviprojet.entities.Phase;
import com.example.suiviprojet.entities.Projet;
import com.example.suiviprojet.exceptions.BusinessException;
import com.example.suiviprojet.exceptions.ResourceNotFoundException;
import com.example.suiviprojet.repositories.PhaseRepository;
import com.example.suiviprojet.repositories.ProjetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PhaseService {

    private final PhaseRepository phaseRepository;
    private final ProjetRepository projetRepository;

    public PhaseService(PhaseRepository phaseRepository,
                        ProjetRepository projetRepository) {
        this.phaseRepository = phaseRepository;
        this.projetRepository = projetRepository;
    }

    public PhaseDTO create(PhaseDTO dto) {

        Projet projet = projetRepository.findById(dto.projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet introuvable"));

        if (dto.dateDebut == null || dto.dateFin == null) {
            throw new BusinessException("Les dates de la phase sont obligatoires");
        }

        if (projet.getDateDebut() == null || projet.getDateFin() == null) {
            throw new BusinessException("Les dates du projet sont manquantes");
        }

        if (dto.dateDebut.isAfter(dto.dateFin)) {
            throw new BusinessException("La date de début doit être avant ou égale à la date de fin");
        }

        if (dto.dateDebut.isBefore(projet.getDateDebut())
                || dto.dateFin.isAfter(projet.getDateFin())) {
            throw new BusinessException("Dates de phase hors intervalle du projet");
        }

        Phase phase = new Phase();

        phase.setCode(dto.code);
        phase.setLibelle(dto.libelle);
        phase.setDescription(dto.description);
        phase.setDateDebut(dto.dateDebut);
        phase.setDateFin(dto.dateFin);
        phase.setMontant(dto.montant);

        phase.setEtatRealisation(false);
        phase.setEtatFacturation(false);
        phase.setEtatPaiement(false);

        phase.setProjet(projet);

        phase = phaseRepository.save(phase);

        return convertToDTO(phase);
    }

    public PhaseDTO findById(Long id) {

        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée"));

        return convertToDTO(phase);
    }

    public List<PhaseDTO> findAll() {

        return phaseRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PhaseDTO> findByProjet(Long projetId) {

        return phaseRepository.findByProjetId(projetId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PhaseDTO update(Long id, PhaseDTO dto) {

        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée"));

        Projet projet = phase.getProjet();

        if (dto.dateDebut == null || dto.dateFin == null) {
            throw new BusinessException("Les dates de la phase sont obligatoires");
        }

        if (dto.dateDebut.isAfter(dto.dateFin)) {
            throw new BusinessException("La date de début doit être avant ou égale à la date de fin");
        }

        if (projet != null) {
            if (projet.getDateDebut() == null || projet.getDateFin() == null) {
                throw new BusinessException("Les dates du projet sont manquantes");
            }

            if (dto.dateDebut.isBefore(projet.getDateDebut())
                    || dto.dateFin.isAfter(projet.getDateFin())) {
                throw new BusinessException("Dates de phase hors intervalle du projet");
            }
        }

        phase.setCode(dto.code);
        phase.setLibelle(dto.libelle);
        phase.setDescription(dto.description);
        phase.setDateDebut(dto.dateDebut);
        phase.setDateFin(dto.dateFin);
        phase.setMontant(dto.montant);

        phase = phaseRepository.save(phase);

        return convertToDTO(phase);
    }

    public void delete(Long id) {
        phaseRepository.deleteById(id);
    }

    public PhaseDTO realiser(Long id) {

        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée"));

        phase.setEtatRealisation(true);

        phase = phaseRepository.save(phase);

        return convertToDTO(phase);
    }

    public PhaseDTO facturer(Long id) {

        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée"));

        phase.setEtatFacturation(true);

        phase = phaseRepository.save(phase);

        return convertToDTO(phase);
    }

    public PhaseDTO payer(Long id) {

        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée"));

        phase.setEtatPaiement(true);

        phase = phaseRepository.save(phase);

        return convertToDTO(phase);
    }

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