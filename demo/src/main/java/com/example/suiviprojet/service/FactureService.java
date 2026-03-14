package com.example.suiviprojet.service;

import com.example.suiviprojet.dto.FactureDTO;
import com.example.suiviprojet.entities.Facture;
import com.example.suiviprojet.entities.Phase;
import com.example.suiviprojet.exceptions.BusinessException;
import com.example.suiviprojet.exceptions.ResourceNotFoundException;
import com.example.suiviprojet.repositories.FactureRepository;
import com.example.suiviprojet.repositories.PhaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FactureService {

    private final FactureRepository factureRepository;
    private final PhaseRepository phaseRepository;

    public FactureService(FactureRepository factureRepository, PhaseRepository phaseRepository) {
        this.factureRepository = factureRepository;
        this.phaseRepository = phaseRepository;
    }

    public FactureDTO create(Long phaseId, FactureDTO dto) {
        Phase phase = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée"));

        if (!Boolean.TRUE.equals(phase.isEtatRealisation())) {
            throw new BusinessException("Impossible de créer une facture pour une phase non réalisée");
        }

        if (phase.getFacture() != null) {
            throw new BusinessException("Cette phase a déjà une facture");
        }

        Facture facture = new Facture();
        facture.setDateFacture(dto.getDateFacture());
        facture.setPayee(dto.getPayee() != null ? dto.getPayee() : false);
        facture.setPhase(phase);

        facture = factureRepository.save(facture);

        phase.setEtatFacturation(true);
        if (Boolean.TRUE.equals(facture.getPayee())) {
            phase.setEtatPaiement(true);
        } else {
            phase.setEtatPaiement(false);
        }
        phaseRepository.save(phase);

        return mapEntityToDto(facture);
    }

    public List<FactureDTO> findAll() {
        return factureRepository.findAll()
                .stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    public FactureDTO findById(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée"));
        return mapEntityToDto(facture);
    }

    public FactureDTO update(Long id, FactureDTO dto) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée"));

        facture.setDateFacture(dto.getDateFacture());
        facture.setPayee(dto.getPayee() != null ? dto.getPayee() : false);

        facture = factureRepository.save(facture);

        Phase phase = facture.getPhase();
        if (phase != null) {
            phase.setEtatFacturation(true);
            phase.setEtatPaiement(Boolean.TRUE.equals(facture.getPayee()));
            phaseRepository.save(phase);
        }

        return mapEntityToDto(facture);
    }

    public void delete(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée"));

        Phase phase = facture.getPhase();
        if (phase != null) {
            phase.setEtatFacturation(false);
            phase.setEtatPaiement(false);
            phaseRepository.save(phase);
        }

        factureRepository.delete(facture);
    }

    private FactureDTO mapEntityToDto(Facture facture) {
        FactureDTO dto = new FactureDTO();
        dto.setId(facture.getId());
        dto.setDateFacture(facture.getDateFacture());
        dto.setPayee(facture.getPayee());
        dto.setPhaseId(facture.getPhase() != null ? facture.getPhase().getId() : null);
        return dto;
    }
}