package com.example.suiviprojet.service;

import com.example.suiviprojet.dto.ProjetDTO;
import com.example.suiviprojet.entities.*;
import com.example.suiviprojet.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProjetService {

    @Autowired private ProjetRepository projetRepo;
    @Autowired private OrganismeRepository orgRepo;
    @Autowired private EmployeRepository empRepo;

    // --- CRUD Operations ---

    public Projet create(ProjetDTO dto) {
        validateProjetDates(dto);
        if (projetRepo.existsByCode(dto.getCode())) {
            throw new RuntimeException("Le code projet doit être unique.");
        }
        Projet p = mapDtoToEntity(dto, new Projet());
        return projetRepo.save(p);
    }

    public Projet update(Long id, ProjetDTO dto) {
        Projet p = projetRepo.findById(id).orElseThrow(() -> new RuntimeException("Projet introuvable"));
        validateProjetDates(dto);
        Projet updatedP = mapDtoToEntity(dto, p);
        return projetRepo.save(updatedP);
    }

    public void delete(Long id) {
        Projet p = projetRepo.findById(id).orElseThrow(() -> new RuntimeException("Projet introuvable"));
        if (p.getPhases() != null && !p.getPhases().isEmpty()) {
            throw new RuntimeException("Impossible de supprimer : le projet contient des phases.");
        }
        projetRepo.delete(p);
    }

    public List<Projet> findAll() { return projetRepo.findAll(); }

    public Projet findById(Long id) {
        return projetRepo.findById(id).orElseThrow(() -> new RuntimeException("Projet introuvable"));
    }

    // --- Business Logic & Summary ---

    public Map<String, Object> getResume(Long id) {
        Projet p = projetRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet introuvable"));

        Map<String, Object> resume = new HashMap<>();

        resume.put("nomProjet", p.getNom());
        resume.put("codeProjet", p.getCode());

        if (p.getChefProjet() != null) {
            resume.put("chefProjet", p.getChefProjet().getNom() + " " + p.getChefProjet().getPrenom());
        } else {
            resume.put("chefProjet", "Aucun chef assigné");
        }

        if (p.getDateDebut() != null && p.getDateFin() != null) {
            long jours = ChronoUnit.DAYS.between(p.getDateDebut(), p.getDateFin());
            resume.put("dureeEnJours", jours);
        }

        return resume;
    }

    // --- Helpers ---

    private void validateProjetDates(ProjetDTO dto) {
        if (dto.getDateDebut().isAfter(dto.getDateFin())) {
            throw new RuntimeException("La date de début doit être avant la date de fin.");
        }
    }

    private Projet mapDtoToEntity(ProjetDTO dto, Projet p) {
        p.setCode(dto.getCode());
        p.setNom(dto.getNom());
        p.setDescription(dto.getDescription());
        p.setDateDebut(dto.getDateDebut());
        p.setDateFin(dto.getDateFin());
        p.setMontant(dto.getMontant());

        Organisme org = orgRepo.findById(dto.getOrganismeId())
                .orElseThrow(() -> new RuntimeException("Organisme non trouvé"));
        Employe emp = empRepo.findById(dto.getChefProjetId())
                .orElseThrow(() -> new RuntimeException("Chef de projet non trouvé"));

        p.setOrganisme(org);
        p.setChefProjet(emp);
        return p;
    }
}