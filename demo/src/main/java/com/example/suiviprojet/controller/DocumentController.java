package com.example.suiviprojet.controller;

import com.example.suiviprojet.dto.DocumentDTO;
import com.example.suiviprojet.service.DocumentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }


    @PostMapping("/projets/{projetId}/documents")
    public DocumentDTO create(@PathVariable Long projetId,
                              @RequestBody DocumentDTO dto) {
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
                              @RequestBody DocumentDTO dto) {
        return documentService.update(id, dto);
    }


    @DeleteMapping("/documents/{id}")
    public void delete(@PathVariable Long id) {
        documentService.delete(id);
    }
}