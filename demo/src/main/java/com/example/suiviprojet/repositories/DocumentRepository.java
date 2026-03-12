package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
}