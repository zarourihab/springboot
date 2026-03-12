package com.example.suiviprojet.service;

import com.example.suiviprojet.dto.OrganismeDTO;
import com.example.suiviprojet.entities.Organisme;
import com.example.suiviprojet.repositories.OrganismeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrganismeService {
    private final OrganismeRepository repo;
    public OrganismeService(OrganismeRepository repo) { this.repo = repo; }

    public OrganismeDTO create(OrganismeDTO dto) {
        Organisme o = new Organisme();
        o.setNom(dto.nom); o.setCode(dto.code); o.setNomContact(dto.contact);
        o = repo.save(o);
        dto.id = o.getId();
        return dto;
    }


    public OrganismeDTO findById(Long id) {
        Organisme o = repo.findById(id).orElseThrow(() -> new RuntimeException("Non trouvé"));
        OrganismeDTO dto = new OrganismeDTO();
        dto.id = o.getId(); dto.nom = o.getNom(); dto.code = o.getCode(); dto.contact = o.getNomContact();
        return dto;
    }


    public OrganismeDTO update(Long id, OrganismeDTO dto) {
        Organisme o = repo.findById(id).orElseThrow(() -> new RuntimeException("Non trouvé"));
        o.setNom(dto.nom); o.setCode(dto.code); o.setNomContact(dto.contact);
        repo.save(o);
        return dto;
    }

    public List<Organisme> findAll(String query) {
        if (query != null) return repo.findByNomContainingOrCodeContainingOrNomContactContaining(query, query, query);
        return repo.findAll();
    }

    public void delete(Long id) { repo.deleteById(id); }
}