package com.example.suiviprojet.dto;

public class LivrableDto {
    private String code;
    private String libelle;
    private String description;
    private String chemin;

    // Getters indispensables pour que le Service fonctionne
    public String getCode() { return code; }
    public String getLibelle() { return libelle; }
    public String getDescription() { return description; }
    public String getChemin() { return chemin; }

    // Setters (optionnels pour le service, mais utiles)
    public void setCode(String code) { this.code = code; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
    public void setDescription(String description) { this.description = description; }
    public void setChemin(String chemin) { this.chemin = chemin; }
}