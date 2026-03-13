package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Livrable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LivrableRepository extends JpaRepository<Livrable, Long> {

    // Cette méthode permet de trouver tous les livrables liés à une phase précise
    List<Livrable> findByPhaseId(Long phaseId);

}