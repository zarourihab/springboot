package com.example.suiviprojet.controller;

import com.example.suiviprojet.dto.OrganismeDTO;
import com.example.suiviprojet.entities.Organisme;
import com.example.suiviprojet.service.OrganismeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/organismes")
public class OrganismeController {
    private final OrganismeService service;
    public OrganismeController(OrganismeService service) { this.service = service; }

    @PostMapping
    public OrganismeDTO create(@Valid @RequestBody OrganismeDTO dto) { return service.create(dto); }

    @GetMapping("/{id}")
    public OrganismeDTO getById(@PathVariable Long id) { return service.findById(id); }

    @GetMapping
    public List<Organisme> getAll(@RequestParam(required = false) String q) { return service.findAll(q); }

    @PutMapping("/{id}")
    public OrganismeDTO update(@PathVariable Long id, @Valid @RequestBody OrganismeDTO dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}