package com.example.suiviprojet.controller;

import com.example.suiviprojet.dto.ProjetDTO;
import com.example.suiviprojet.service.ProjetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projets")
public class ProjetController {

    private final ProjetService projetService;

    public ProjetController(ProjetService projetService) {
        this.projetService = projetService;
    }

    @PostMapping
    public ResponseEntity<ProjetDTO> create(@Valid @RequestBody ProjetDTO dto) {
        return ResponseEntity.ok(projetService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjetDTO> update(@PathVariable Long id,
                                            @Valid @RequestBody ProjetDTO dto) {
        return ResponseEntity.ok(projetService.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjetDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projetService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<ProjetDTO>> getAll(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(projetService.findAll(q));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projetService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/resume")
    public ResponseEntity<Map<String, Object>> getResume(@PathVariable Long id) {
        return ResponseEntity.ok(projetService.getResume(id));
    }
}