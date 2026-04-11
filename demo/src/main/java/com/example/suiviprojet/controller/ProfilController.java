package com.example.suiviprojet.controller;

import com.example.suiviprojet.repositories.ProfilRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profils")
public class ProfilController {

    private final ProfilRepository profilRepository;

    public ProfilController(ProfilRepository profilRepository) {
        this.profilRepository = profilRepository;
    }

    @GetMapping
    public List<Map<String, Object>> getAll() {
        List<Map<String, Object>> result = new ArrayList<>();
        profilRepository.findAll().forEach(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id",      p.getId());
            map.put("code",    p.getCode() != null ? p.getCode() : "");
            map.put("libelle", p.getLibelle() != null ? p.getLibelle() : "");
            result.add(map);
        });
        return result;
    }
}