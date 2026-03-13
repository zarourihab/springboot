package com.example.suiviprojet.controller;

import com.example.suiviprojet.dto.AffectationDTO;
import com.example.suiviprojet.service.AffectationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AffectationController {

    private final AffectationService affectationService;

    public AffectationController(AffectationService affectationService) {
        this.affectationService = affectationService;
    }

    @PostMapping("/api/phases/{phaseId}/employes/{employeId}")
    public ResponseEntity<AffectationDTO> create(@PathVariable Long phaseId,
                                                 @PathVariable Long employeId,
                                                 @Valid @RequestBody AffectationDTO dto) {
        return ResponseEntity.ok(affectationService.create(phaseId, employeId, dto));
    }

    @GetMapping("/api/phases/{phaseId}/employes")
    public ResponseEntity<List<AffectationDTO>> getByPhase(@PathVariable Long phaseId) {
        return ResponseEntity.ok(affectationService.findByPhase(phaseId));
    }

    @GetMapping("/api/phases/{phaseId}/employes/{employeId}")
    public ResponseEntity<AffectationDTO> getOne(@PathVariable Long phaseId,
                                                 @PathVariable Long employeId) {
        return ResponseEntity.ok(affectationService.findOne(phaseId, employeId));
    }

    @PutMapping("/api/phases/{phaseId}/employes/{employeId}")
    public ResponseEntity<AffectationDTO> update(@PathVariable Long phaseId,
                                                 @PathVariable Long employeId,
                                                 @Valid @RequestBody AffectationDTO dto) {
        return ResponseEntity.ok(affectationService.update(phaseId, employeId, dto));
    }

    @DeleteMapping("/api/phases/{phaseId}/employes/{employeId}")
    public ResponseEntity<Void> delete(@PathVariable Long phaseId,
                                       @PathVariable Long employeId) {
        affectationService.delete(phaseId, employeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/employes/{employeId}/phases")
    public ResponseEntity<List<AffectationDTO>> getPhasesByEmploye(@PathVariable Long employeId) {
        return ResponseEntity.ok(affectationService.findByEmploye(employeId));
    }
}