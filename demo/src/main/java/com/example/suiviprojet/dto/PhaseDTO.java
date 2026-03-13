package com.example.suiviprojet.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class PhaseDTO {

    public Long id;

    public String code;

    public String libelle;

    public String description;
    @NotNull
    public LocalDate dateDebut;
    @NotNull
    public LocalDate dateFin;
    @NotNull
    public Double montant;

    public Boolean etatRealisation;

    public Boolean etatFacturation;

    public Boolean etatPaiement;

    public Long projetId;


}