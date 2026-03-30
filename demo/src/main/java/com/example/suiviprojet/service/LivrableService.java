package com.example.suiviprojet.service;

import com.example.suiviprojet.dto.LivrableDTO;
import com.example.suiviprojet.entities.Livrable;
import com.example.suiviprojet.entities.Phase;
import com.example.suiviprojet.exceptions.ResourceNotFoundException;
import com.example.suiviprojet.repositories.LivrableRepository;
import com.example.suiviprojet.repositories.PhaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LivrableService {

    private final LivrableRepository livrableRepository;
    private final PhaseRepository phaseRepository;

    public LivrableService(LivrableRepository livrableRepository, PhaseRepository phaseRepository) {
        this.livrableRepository = livrableRepository;
        this.phaseRepository = phaseRepository;
    }

    public LivrableDTO addLivrable(Long phaseId, LivrableDTO dto) {
        Phase phase = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Phase introuvable avec l'ID : " + phaseId));

        Livrable livrable = new Livrable();
        livrable.setCode(dto.getCode());
        livrable.setLibelle(dto.getLibelle());
        livrable.setDescription(dto.getDescription());
        livrable.setChemin(dto.getChemin());
        livrable.setPhase(phase);

        livrable = livrableRepository.save(livrable);
        return mapEntityToDto(livrable);
    }

    public List<LivrableDTO> getLivrablesByPhase(Long phaseId) {
        if (!phaseRepository.existsById(phaseId)) {
            throw new ResourceNotFoundException("Phase introuvable avec l'ID : " + phaseId);
        }
        return livrableRepository.findByPhaseId(phaseId)
                .stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    public LivrableDTO getLivrableById(Long id) {
        Livrable livrable = livrableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livrable non trouvé avec l'ID : " + id));
        return mapEntityToDto(livrable);
    }

    public LivrableDTO updateLivrable(Long id, LivrableDTO dto) {
        Livrable livrable = livrableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livrable non trouvé avec l'ID : " + id));
        livrable.setLibelle(dto.getLibelle());
        livrable.setDescription(dto.getDescription());
        livrable.setChemin(dto.getChemin());
        livrable = livrableRepository.save(livrable);
        return mapEntityToDto(livrable);
    }

    public void deleteLivrable(Long id) {
        if (!livrableRepository.existsById(id)) {
            throw new ResourceNotFoundException("Impossible de supprimer : Livrable introuvable");
        }
        livrableRepository.deleteById(id);
    }

    private LivrableDTO mapEntityToDto(Livrable livrable) {
        LivrableDTO dto = new LivrableDTO();
        dto.setId(livrable.getId());
        dto.setCode(livrable.getCode());
        dto.setLibelle(livrable.getLibelle());
        dto.setDescription(livrable.getDescription());
        dto.setChemin(livrable.getChemin());
        if (livrable.getPhase() != null) {
            dto.setPhaseId(livrable.getPhase().getId());
        }
        return dto;
    }
}
