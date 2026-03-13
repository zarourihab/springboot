package com.example.suiviprojet.controller;

import com.example.suiviprojet.dto.EmployeDTO;
import com.example.suiviprojet.service.EmployeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employes")
public class EmployeController {

    private final EmployeService service;

    public EmployeController(EmployeService service) {
        this.service = service;
    }

    @PostMapping
    public EmployeDTO create(@Valid @RequestBody EmployeDTO dto) {
        return service.create(dto);
    }

    @GetMapping("/{id}")
    public EmployeDTO getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping
    public List<EmployeDTO> getAll(@RequestParam(required = false) String q) {
        return service.findAll(q);
    }

    @PutMapping("/{id}")
    public EmployeDTO update(@PathVariable Long id, @Valid @RequestBody EmployeDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}