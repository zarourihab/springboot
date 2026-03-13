package com.example.suiviprojet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class ProjetDTO {

    private Long id;

    @NotBlank(message = "Le code du projet est obligatoire")
    private String code;

    @NotBlank(message = "Le nom du projet est obligatoire")
    private String nom;

    private String description;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;

    @NotNull(message = "Le montant est obligatoire")
    private Double montant;

    @NotNull(message = "L'organisme est obligatoire")
    private Long organismeId;

    @NotNull(message = "Le chef de projet est obligatoire")
    private Long chefProjetId;

    public ProjetDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public Double getMontant() {
        return montant;
    }

    public void setMontant(Double montant) {
        this.montant = montant;
    }

    public Long getOrganismeId() {
        return organismeId;
    }

    public void setOrganismeId(Long organismeId) {
        this.organismeId = organismeId;
    }

    public Long getChefProjetId() {
        return chefProjetId;
    }

    public void setChefProjetId(Long chefProjetId) {
        this.chefProjetId = chefProjetId;
    }
}