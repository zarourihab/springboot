package com.example.suiviprojet.service;

import com.example.suiviprojet.dto.DocumentDTO;
import com.example.suiviprojet.entities.Document;
import com.example.suiviprojet.entities.Projet;
import com.example.suiviprojet.exceptions.ResourceNotFoundException;
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


    public DocumentDTO create(Long projetId, DocumentDTO dto) {

        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet introuvable"));

        Document document = new Document();

        document.setCode(dto.code);
        document.setLibelle(dto.libelle);
        document.setDescription(dto.description);
        document.setChemin(dto.chemin);
        document.setProjet(projet);

        documentRepository.save(document);

        return convertToDTO(document);
    }


    public DocumentDTO findById(Long id) {

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document introuvable"));

        return convertToDTO(document);
    }


    public List<DocumentDTO> findByProjet(Long projetId) {

        return documentRepository.findByProjetId(projetId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    public DocumentDTO update(Long id, DocumentDTO dto) {

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document introuvable"));

        document.setCode(dto.code);
        document.setLibelle(dto.libelle);
        document.setDescription(dto.description);
        document.setChemin(dto.chemin);

        documentRepository.save(document);

        return convertToDTO(document);
    }


    public void delete(Long id) {
        documentRepository.deleteById(id);
    }


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