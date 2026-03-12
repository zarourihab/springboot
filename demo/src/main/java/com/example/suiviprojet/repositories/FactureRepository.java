package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Facture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FactureRepository extends JpaRepository<Facture, Long> {
}