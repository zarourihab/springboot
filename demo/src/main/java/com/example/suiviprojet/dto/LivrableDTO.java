package com.example.suiviprojet.dto;

import jakarta.validation.constraints.NotBlank;

public class LivrableDTO {

    // ✅ AJOUTÉ : id et phaseId pour les réponses
    private Long id;
    private Long phaseId;

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    @NotBlank(message = "Le libellé est obligatoire")
    private String libelle;

    private String description;
    private String chemin;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPhaseId() { return phaseId; }
    public void setPhaseId(Long phaseId) { this.phaseId = phaseId; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getChemin() { return chemin; }
    public void setChemin(String chemin) { this.chemin = chemin; }
}
