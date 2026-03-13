package com.example.suiviprojet.dto;

import java.time.LocalDate;

public class ProjetDTO {
    private String code;
    private String nom;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Double montant;
    private Long organismeId;
    private Long chefProjetId;

    // Constructor par défaut
    public ProjetDTO() {}

    // Getters
    public String getCode() { return code; }
    public String getNom() { return nom; }
    public String getDescription() { return description; }
    public LocalDate getDateDebut() { return dateDebut; }
    public LocalDate getDateFin() { return dateFin; }
    public Double getMontant() { return montant; }
    public Long getOrganismeId() { return organismeId; }
    public Long getChefProjetId() { return chefProjetId; }

    // Setters
    public void setCode(String code) { this.code = code; }
    public void setNom(String nom) { this.nom = nom; }
    public void setDescription(String description) { this.description = description; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }
    public void setMontant(Double montant) { this.montant = montant; }
    public void setOrganismeId(Long organismeId) { this.organismeId = organismeId; }
    public void setChefProjetId(Long chefProjetId) { this.chefProjetId = chefProjetId; }
}