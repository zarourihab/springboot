package com.example.suiviprojet.service;

import com.example.suiviprojet.dto.OrganismeDTO;
import com.example.suiviprojet.entities.Organisme;
import com.example.suiviprojet.exceptions.ResourceNotFoundException;
import com.example.suiviprojet.repositories.OrganismeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrganismeService {

    private final OrganismeRepository repo;

    public OrganismeService(OrganismeRepository repo) {
        this.repo = repo;
    }

    public OrganismeDTO create(OrganismeDTO dto) {
        Organisme o = new Organisme();
        o.setNom(dto.getNom());
        o.setCode(dto.getCode());
        o.setNomContact(dto.getContact());
        o.setAdresse(dto.getAdresse());
        o.setEmailContact(dto.getEmailContact());
        o = repo.save(o);
        return mapEntityToDto(o);
    }

    public OrganismeDTO findById(Long id) {
        Organisme o = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organisme non trouvé"));
        return mapEntityToDto(o);
    }

    public OrganismeDTO update(Long id, OrganismeDTO dto) {
        Organisme o = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organisme non trouvé"));
        o.setNom(dto.getNom());
        o.setCode(dto.getCode());
        o.setNomContact(dto.getContact());
        o.setAdresse(dto.getAdresse());
        o.setEmailContact(dto.getEmailContact());
        o = repo.save(o);
        return mapEntityToDto(o);
    }

    public List<OrganismeDTO> findAll(String query) {
        List<Organisme> organismes;
        if (query != null && !query.isBlank()) {
            organismes = repo.findByNomContainingOrCodeContainingOrNomContactContaining(query, query, query);
        } else {
            organismes = repo.findAll();
        }
        return organismes.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Organisme non trouvé"));
        repo.deleteById(id);
    }

    private OrganismeDTO mapEntityToDto(Organisme o) {
        OrganismeDTO dto = new OrganismeDTO();
        dto.setId(o.getId());
        dto.setCode(o.getCode());
        dto.setNom(o.getNom());
        dto.setAdresse(o.getAdresse());
        dto.setContact(o.getNomContact());
        dto.setEmailContact(o.getEmailContact());
        return dto;
    }
}
