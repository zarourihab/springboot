package com.example.suiviprojet.dto;

import jakarta.validation.constraints.NotBlank;

public class LivrableDTO {

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    @NotBlank(message = "Le libellé est obligatoire")
    private String libelle;
    private String description;
    private String chemin;


    public String getCode() { return code; }
    public String getLibelle() { return libelle; }
    public String getDescription() { return description; }
    public String getChemin() { return chemin; }


    public void setCode(String code) { this.code = code; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
    public void setDescription(String description) { this.description = description; }
    public void setChemin(String chemin) { this.chemin = chemin; }
}