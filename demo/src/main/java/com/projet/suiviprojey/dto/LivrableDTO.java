package com.projet.suiviprojet.dto;

public class LivrableDTO {
    private Long id;
    private String nom;
    private String description;
    private Long phaseId;

    // Constructeur par défaut
    public LivrableDTO() {
    }

    // Constructeur avec paramètres
    public LivrableDTO(Long id, String nom, String description, Long phaseId) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.phaseId = phaseId;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getPhaseId() {
        return phaseId;
    }

    public void setPhaseId(Long phaseId) {
        this.phaseId = phaseId;
    }
}