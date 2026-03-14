package com.example.suiviprojet.service;

import com.example.suiviprojet.dto.ProjetDTO;
import com.example.suiviprojet.entities.Employe;
import com.example.suiviprojet.entities.Organisme;
import com.example.suiviprojet.entities.Phase;
import com.example.suiviprojet.entities.Projet;
import com.example.suiviprojet.exceptions.BusinessException;
import com.example.suiviprojet.exceptions.ResourceNotFoundException;
import com.example.suiviprojet.repositories.EmployeRepository;
import com.example.suiviprojet.repositories.OrganismeRepository;
import com.example.suiviprojet.repositories.ProjetRepository;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProjetService {

    private final ProjetRepository projetRepository;
    private final OrganismeRepository organismeRepository;
    private final EmployeRepository employeRepository;

    public ProjetService(ProjetRepository projetRepository,
                         OrganismeRepository organismeRepository,
                         EmployeRepository employeRepository) {
        this.projetRepository = projetRepository;
        this.organismeRepository = organismeRepository;
        this.employeRepository = employeRepository;
    }

    public ProjetDTO create(ProjetDTO dto) {
        validateProjet(dto);

        if (projetRepository.existsByCode(dto.getCode())) {
            throw new BusinessException("Le code projet est déjà utilisé");
        }

        Projet projet = new Projet();
        mapDtoToEntity(dto, projet);

        projet = projetRepository.save(projet);
        return mapEntityToDto(projet);
    }

    public ProjetDTO update(Long id, ProjetDTO dto) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Projet introuvable"));

        validateProjet(dto);

        projetRepository.findByCode(dto.getCode()).ifPresent(existingProjet -> {
            if (!existingProjet.getId().equals(id)) {
                throw new BusinessException("Le code projet est déjà utilisé");
            }
        });

        mapDtoToEntity(dto, projet);
        projet = projetRepository.save(projet);

        return mapEntityToDto(projet);
    }

    public void delete(Long id) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Projet introuvable"));

        if (projet.getPhases() != null && !projet.getPhases().isEmpty()) {
            throw new BusinessException("Impossible de supprimer : le projet contient des phases");
        }

        projetRepository.delete(projet);
    }

    public ProjetDTO findById(Long id) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Projet introuvable"));
        return mapEntityToDto(projet);
    }

    public List<ProjetDTO> findAll(String query) {
        List<Projet> projets;

        if (query != null && !query.isBlank()) {
            projets = projetRepository.findByNomContainingOrCodeContaining(query, query);
        } else {
            projets = projetRepository.findAll();
        }

        return projets.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getResume(Long id) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Projet introuvable"));

        Map<String, Object> resume = new HashMap<>();
        resume.put("id", projet.getId());
        resume.put("codeProjet", projet.getCode());
        resume.put("nomProjet", projet.getNom());
        resume.put("description", projet.getDescription());
        resume.put("dateDebut", projet.getDateDebut());
        resume.put("dateFin", projet.getDateFin());
        resume.put("montantProjet", projet.getMontant());

        if (projet.getOrganisme() != null) {
            resume.put("organisme", projet.getOrganisme().getNom());
        } else {
            resume.put("organisme", null);
        }

        if (projet.getChefProjet() != null) {
            resume.put("chefProjet",
                    projet.getChefProjet().getNom() + " " + projet.getChefProjet().getPrenom());
        } else {
            resume.put("chefProjet", null);
        }

        if (projet.getDateDebut() != null && projet.getDateFin() != null) {
            long duree = ChronoUnit.DAYS.between(projet.getDateDebut(), projet.getDateFin());
            resume.put("dureeEnJours", duree);
        }

        int nombrePhases = projet.getPhases() != null ? projet.getPhases().size() : 0;
        resume.put("nombrePhases", nombrePhases);

        double totalMontantsPhases = 0.0;
        if (projet.getPhases() != null) {
            for (Phase phase : projet.getPhases()) {
                if (phase.getMontant() != null) {
                    totalMontantsPhases += phase.getMontant();
                }
            }
        }
        resume.put("totalMontantsPhases", totalMontantsPhases);

        return resume;
    }

    private void validateProjet(ProjetDTO dto) {
        if (dto.getDateDebut() != null && dto.getDateFin() != null
                && dto.getDateDebut().isAfter(dto.getDateFin())) {
            throw new BusinessException("La date de début doit être avant ou égale à la date de fin");
        }

        if (dto.getMontant() != null && dto.getMontant() < 0) {
            throw new BusinessException("Le montant ne peut pas être négatif");
        }
    }

    private void mapDtoToEntity(ProjetDTO dto, Projet projet) {
        projet.setCode(dto.getCode());
        projet.setNom(dto.getNom());
        projet.setDescription(dto.getDescription());
        projet.setDateDebut(dto.getDateDebut());
        projet.setDateFin(dto.getDateFin());
        projet.setMontant(dto.getMontant());

        Organisme organisme = organismeRepository.findById(dto.getOrganismeId())
                .orElseThrow(() -> new ResourceNotFoundException("Organisme non trouvé"));

        Employe chefProjet = employeRepository.findById(dto.getChefProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Chef de projet non trouvé"));

        projet.setOrganisme(organisme);
        projet.setChefProjet(chefProjet);
    }

    private ProjetDTO mapEntityToDto(Projet projet) {
        ProjetDTO dto = new ProjetDTO();
        dto.setId(projet.getId());
        dto.setCode(projet.getCode());
        dto.setNom(projet.getNom());
        dto.setDescription(projet.getDescription());
        dto.setDateDebut(projet.getDateDebut());
        dto.setDateFin(projet.getDateFin());
        dto.setMontant(projet.getMontant());
        dto.setOrganismeId(
                projet.getOrganisme() != null ? projet.getOrganisme().getId() : null
        );
        dto.setChefProjetId(
                projet.getChefProjet() != null ? projet.getChefProjet().getId() : null
        );
        return dto;
    }
}