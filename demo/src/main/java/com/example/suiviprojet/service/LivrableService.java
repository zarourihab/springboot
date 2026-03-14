package com.example.suiviprojet.service;

import com.example.suiviprojet.dto.LivrableDTO;
import com.example.suiviprojet.entities.Livrable;
import com.example.suiviprojet.entities.Phase;
import com.example.suiviprojet.repositories.LivrableRepository;
import com.example.suiviprojet.repositories.PhaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LivrableService {

    @Autowired
    private LivrableRepository livrableRepository;

    @Autowired
    private PhaseRepository phaseRepository;


    public Livrable addLivrable(Long phaseId, LivrableDTO dto) {

        Phase phase = phaseRepository.findById(phaseId)
                .orElseThrow(() ->
                        new RuntimeException("Phase introuvable avec l'ID : " + phaseId)
                );

        Livrable livrable = new Livrable();

        livrable.setCode(dto.getCode());
        livrable.setLibelle(dto.getLibelle());
        livrable.setDescription(dto.getDescription());
        livrable.setChemin(dto.getChemin());

        livrable.setPhase(phase);

        return livrableRepository.save(livrable);
    }


    public List<Livrable> getLivrablesByPhase(Long phaseId) {

        if (!phaseRepository.existsById(phaseId)) {
            throw new RuntimeException("Phase introuvable avec l'ID : " + phaseId);
        }

        return livrableRepository.findByPhaseId(phaseId);
    }


    public Livrable getLivrableById(Long id) {

        return livrableRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Livrable non trouvé avec l'ID : " + id)
                );
    }


    public Livrable updateLivrable(Long id, LivrableDTO dto) {

        Livrable livrable = getLivrableById(id);

        livrable.setLibelle(dto.getLibelle());
        livrable.setDescription(dto.getDescription());
        livrable.setChemin(dto.getChemin());

        return livrableRepository.save(livrable);
    }


    public void deleteLivrable(Long id) {

        if (!livrableRepository.existsById(id)) {
            throw new RuntimeException("Impossible de supprimer : Livrable introuvable");
        }

        livrableRepository.deleteById(id);
    }
}