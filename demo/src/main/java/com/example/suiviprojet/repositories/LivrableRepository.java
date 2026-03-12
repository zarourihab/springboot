package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Livrable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LivrableRepository extends JpaRepository<Livrable, Long> {
}