package com.example.suiviprojet.controller;

import com.example.suiviprojet.dto.PhaseDTO;
import com.example.suiviprojet.service.PhaseService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PhaseController {

    private final PhaseService phaseService;

    public PhaseController(PhaseService phaseService) {
        this.phaseService = phaseService;
    }

    // Créer une phase dans un projet
    @PostMapping("/projets/{projetId}/phases")
    public PhaseDTO create(@PathVariable Long projetId,
                           @Valid@RequestBody PhaseDTO dto) {

        dto.projetId = projetId;
        return phaseService.create(dto);
    }

    // Phases d’un projet
    @GetMapping("/projets/{projetId}/phases")
    public List<PhaseDTO> getPhasesByProjet(@PathVariable Long projetId) {
        return phaseService.findByProjet(projetId);
    }

    // Trouver une phase
    @GetMapping("/phases/{id}")
    public PhaseDTO findById(@PathVariable Long id) {
        return phaseService.findById(id);
    }

    // Modifier
    @PutMapping("/phases/{id}")
    public PhaseDTO update(@PathVariable Long id,
                          @Valid @RequestBody PhaseDTO dto) {
        return phaseService.update(id, dto);
    }

    // Supprimer
    @DeleteMapping("/phases/{id}")
    public void delete(@PathVariable Long id) {
        phaseService.delete(id);
    }

    // Réalisation
    @PatchMapping("/phases/{id}/realisation")
    public PhaseDTO realiser(@PathVariable Long id) {
        return phaseService.realiser(id);
    }

    // Facturation
    @PatchMapping("/phases/{id}/facturation")
    public PhaseDTO facturer(@PathVariable Long id) {
        return phaseService.facturer(id);
    }

    // Paiement
    @PatchMapping("/phases/{id}/paiement")
    public PhaseDTO payer(@PathVariable Long id) {
        return phaseService.payer(id);
    }

}