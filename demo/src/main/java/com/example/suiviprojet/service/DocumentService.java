package com.example.suiviprojet.service;

import com.example.suiviprojet.dto.DocumentDTO;
import com.example.suiviprojet.entities.Document;
import com.example.suiviprojet.entities.Projet;
import com.example.suiviprojet.repositories.DocumentRepository;
import com.example.suiviprojet.repositories.ProjetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ProjetRepository projetRepository;

    public DocumentService(DocumentRepository documentRepository,
                           ProjetRepository projetRepository) {
        this.documentRepository = documentRepository;
        this.projetRepository = projetRepository;
    }

    // Créer un document pour un projet
    public DocumentDTO create(Long projetId, DocumentDTO dto) {

        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new RuntimeException("Projet introuvable"));

        Document document = new Document();

        document.setCode(dto.code);
        document.setLibelle(dto.libelle);
        document.setDescription(dto.description);
        document.setChemin(dto.chemin);
        document.setProjet(projet);

        documentRepository.save(document);

        return convertToDTO(document);
    }

    // Trouver un document par id
    public DocumentDTO findById(Long id) {

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document introuvable"));

        return convertToDTO(document);
    }

    // Documents d'un projet
    public List<DocumentDTO> findByProjet(Long projetId) {

        return documentRepository.findByProjetId(projetId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Modifier document
    public DocumentDTO update(Long id, DocumentDTO dto) {

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document introuvable"));

        document.setCode(dto.code);
        document.setLibelle(dto.libelle);
        document.setDescription(dto.description);
        document.setChemin(dto.chemin);

        documentRepository.save(document);

        return convertToDTO(document);
    }

    // Supprimer document
    public void delete(Long id) {
        documentRepository.deleteById(id);
    }

    // Conversion Entity → DTO
    private DocumentDTO convertToDTO(Document doc) {

        DocumentDTO dto = new DocumentDTO();

        dto.id = doc.getId();
        dto.code = doc.getCode();
        dto.libelle = doc.getLibelle();
        dto.description = doc.getDescription();
        dto.chemin = doc.getChemin();

        if (doc.getProjet() != null) {
            dto.projetId = doc.getProjet().getId();
        }

        return dto;
    }
}