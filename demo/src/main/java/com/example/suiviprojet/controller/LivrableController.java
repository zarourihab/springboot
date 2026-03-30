package com.example.suiviprojet.controller;

import com.example.suiviprojet.dto.LivrableDTO;
import com.example.suiviprojet.service.LivrableService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LivrableController {

    private final LivrableService livrableService;

    public LivrableController(LivrableService livrableService) {
        this.livrableService = livrableService;
    }

    @PostMapping("/phases/{phaseId}/livrables")
    public LivrableDTO add(@PathVariable Long phaseId, @Valid @RequestBody LivrableDTO dto) {
        return livrableService.addLivrable(phaseId, dto);
    }

    @GetMapping("/phases/{phaseId}/livrables")
    public List<LivrableDTO> getByPhase(@PathVariable Long phaseId) {
        return livrableService.getLivrablesByPhase(phaseId);
    }

    @GetMapping("/livrables/{id}")
    public LivrableDTO getById(@PathVariable Long id) {
        return livrableService.getLivrableById(id);
    }

    @PutMapping("/livrables/{id}")
    public LivrableDTO update(@PathVariable Long id, @Valid @RequestBody LivrableDTO dto) {
        return livrableService.updateLivrable(id, dto);
    }

    @DeleteMapping("/livrables/{id}")
    public void delete(@PathVariable Long id) {
        livrableService.deleteLivrable(id);
    }
}