package com.example.suiviprojet.controller;

import com.example.suiviprojet.dto.FactureDTO;
import com.example.suiviprojet.service.FactureService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FactureController {

    private final FactureService factureService;

    public FactureController(FactureService factureService) {
        this.factureService = factureService;
    }

    @PostMapping("/phases/{phaseId}/facture")
    public ResponseEntity<FactureDTO> create(@PathVariable Long phaseId,
                                             @Valid @RequestBody FactureDTO dto) {
        return ResponseEntity.ok(factureService.create(phaseId, dto));
    }

    @GetMapping("/factures")
    public ResponseEntity<List<FactureDTO>> getAll() {
        return ResponseEntity.ok(factureService.findAll());
    }

    @GetMapping("/factures/{id}")
    public ResponseEntity<FactureDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(factureService.findById(id));
    }

    @PutMapping("/factures/{id}")
    public ResponseEntity<FactureDTO> update(@PathVariable Long id,
                                             @Valid @RequestBody FactureDTO dto) {
        return ResponseEntity.ok(factureService.update(id, dto));
    }

    @DeleteMapping("/factures/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        factureService.delete(id);
        return ResponseEntity.noContent().build();
    }
}