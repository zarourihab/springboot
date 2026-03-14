package com.example.suiviprojet.controller;

import com.example.suiviprojet.dto.LivrableDTO;
import com.example.suiviprojet.entities.Livrable;
import com.example.suiviprojet.service.LivrableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LivrableController {

    @Autowired
    private LivrableService livrableService;


    @PostMapping("/phases/{phaseId}/livrables")
    public Livrable add(@PathVariable Long phaseId, @RequestBody LivrableDTO dto) {
        return livrableService.addLivrable(phaseId, dto);
    }


    @GetMapping("/phases/{phaseId}/livrables")
    public List<Livrable> getByPhase(@PathVariable Long phaseId) {
        return livrableService.getLivrablesByPhase(phaseId);
    }


    @GetMapping("/livrables/{id}")
    public Livrable getById(@PathVariable Long id) {
        return livrableService.getLivrableById(id);
    }


    @PutMapping("/livrables/{id}")
    public Livrable update(@PathVariable Long id, @RequestBody LivrableDTO dto) {
        return livrableService.updateLivrable(id, dto);
    }


    @DeleteMapping("/livrables/{id}")
    public void delete(@PathVariable Long id) {
        livrableService.deleteLivrable(id);
    }
}