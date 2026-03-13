package com.example.suiviprojet.service;

import com.example.suiviprojet.dto.AffectationDTO;
import com.example.suiviprojet.entities.Affectation;
import com.example.suiviprojet.entities.AffectationId;
import com.example.suiviprojet.entities.Employe;
import com.example.suiviprojet.entities.Phase;
import com.example.suiviprojet.repositories.AffectationRepository;
import com.example.suiviprojet.repositories.EmployeRepository;
import com.example.suiviprojet.repositories.PhaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AffectationService {

    private final AffectationRepository affectationRepository;
    private final EmployeRepository employeRepository;
    private final PhaseRepository phaseRepository;

    public AffectationService(AffectationRepository affectationRepository,
                              EmployeRepository employeRepository,
                              PhaseRepository phaseRepository) {
        this.affectationRepository = affectationRepository;
        this.employeRepository = employeRepository;
        this.phaseRepository = phaseRepository;
    }

    public AffectationDTO create(Long phaseId, Long employeId, AffectationDTO dto) {
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé"));

        Phase phase = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new RuntimeException("Phase non trouvée"));

        if (affectationRepository.existsByEmployeIdAndPhaseId(employeId, phaseId)) {
            throw new RuntimeException("Cette affectation existe déjà");
        }

        AffectationId id = new AffectationId();
        id.setEmployeId(employeId);
        id.setPhaseId(phaseId);

        Affectation affectation = new Affectation();
        affectation.setId(id);
        affectation.setEmploye(employe);
        affectation.setPhase(phase);
        affectation.setRole(dto.getRole());

        affectation = affectationRepository.save(affectation);
        return mapEntityToDto(affectation);
    }

    public List<AffectationDTO> findByPhase(Long phaseId) {
        Phase phase = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new RuntimeException("Phase non trouvée"));

        return affectationRepository.findByPhaseId(phase.getId())
                .stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    public AffectationDTO findOne(Long phaseId, Long employeId) {
        AffectationId id = new AffectationId();
        id.setEmployeId(employeId);
        id.setPhaseId(phaseId);

        Affectation affectation = affectationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Affectation non trouvée"));

        return mapEntityToDto(affectation);
    }

    public AffectationDTO update(Long phaseId, Long employeId, AffectationDTO dto) {
        AffectationId id = new AffectationId();
        id.setEmployeId(employeId);
        id.setPhaseId(phaseId);

        Affectation affectation = affectationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Affectation non trouvée"));

        affectation.setRole(dto.getRole());
        affectation = affectationRepository.save(affectation);

        return mapEntityToDto(affectation);
    }

    public void delete(Long phaseId, Long employeId) {
        AffectationId id = new AffectationId();
        id.setEmployeId(employeId);
        id.setPhaseId(phaseId);

        Affectation affectation = affectationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Affectation non trouvée"));

        affectationRepository.delete(affectation);
    }

    public List<AffectationDTO> findByEmploye(Long employeId) {
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé"));

        return affectationRepository.findByEmployeId(employe.getId())
                .stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    private AffectationDTO mapEntityToDto(Affectation affectation) {
        AffectationDTO dto = new AffectationDTO();
        dto.setEmployeId(affectation.getEmploye().getId());
        dto.setPhaseId(affectation.getPhase().getId());
        dto.setRole(affectation.getRole());
        return dto;
    }
}