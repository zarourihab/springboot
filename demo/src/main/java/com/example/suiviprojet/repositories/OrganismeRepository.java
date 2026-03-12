package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Organisme;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrganismeRepository extends JpaRepository<Organisme, Long> {

    List<Organisme> findByNomContainingOrCodeContainingOrNomContactContaining(String nom, String code, String nomContact);

}