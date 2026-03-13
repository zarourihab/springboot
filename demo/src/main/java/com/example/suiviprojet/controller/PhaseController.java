package com.example.suiviprojet.controller;

import com.example.suiviprojet.dto.PhaseDTO;
import com.example.suiviprojet.service.PhaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/phases")
public class PhaseController {

    private final PhaseService phaseService;

    public PhaseController(PhaseService phaseService) {
        this.phaseService = phaseService;
    }

    // Créer une phase
    @PostMapping
    public PhaseDTO create(@RequestBody PhaseDTO dto) {
        return phaseService.create(dto);
    }

    // Liste de toutes les phases
    @GetMapping
    public List<PhaseDTO> findAll() {
        return phaseService.findAll();
    }

    // Trouver une phase par ID
    @GetMapping("/{id}")
    public PhaseDTO findById(@PathVariable Long id) {
        return phaseService.findById(id);
    }

    // Phases d’un projet
    @GetMapping("/projet/{projetId}")
    public List<PhaseDTO> findByProjet(@PathVariable Long projetId) {
        return phaseService.findByProjet(projetId);
    }

    // Modifier une phase
    @PutMapping("/{id}")
    public PhaseDTO update(@PathVariable Long id, @RequestBody PhaseDTO dto) {
        return phaseService.update(id, dto);
    }

    // Supprimer une phase
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        phaseService.delete(id);
    }
}