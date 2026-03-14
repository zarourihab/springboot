package com.example.suiviprojet.controller;

import com.example.suiviprojet.dto.DocumentDTO;
import com.example.suiviprojet.entities.Document;
import com.example.suiviprojet.repositories.DocumentRepository;
import com.example.suiviprojet.service.DocumentService;

import jakarta.validation.Valid;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api")
public class DocumentController {

    private final DocumentService documentService;
    private final DocumentRepository documentRepository;

    public DocumentController(DocumentService documentService,
                              DocumentRepository documentRepository) {
        this.documentService = documentService;
        this.documentRepository = documentRepository;
    }


    @PostMapping("/projets/{projetId}/documents")
    public DocumentDTO create(@PathVariable Long projetId,
                              @Valid @RequestBody DocumentDTO dto) {
        return documentService.create(projetId, dto);
    }


    @GetMapping("/projets/{projetId}/documents")
    public List<DocumentDTO> getByProjet(@PathVariable Long projetId) {
        return documentService.findByProjet(projetId);
    }


    @GetMapping("/documents/{id}")
    public DocumentDTO getById(@PathVariable Long id) {
        return documentService.findById(id);
    }


    @PutMapping("/documents/{id}")
    public DocumentDTO update(@PathVariable Long id,
                              @Valid @RequestBody DocumentDTO dto) {
        return documentService.update(id, dto);
    }


    @DeleteMapping("/documents/{id}")
    public void delete(@PathVariable Long id) {
        documentService.delete(id);
    }


    @GetMapping("/documents/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) throws Exception {

        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document introuvable"));

        Path path = Paths.get(doc.getChemin());
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + path.getFileName().toString() + "\"")
                .body(resource);
    }
}