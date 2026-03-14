package com.example.suiviprojet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class PhaseDTO {

    public Long id;
    @NotBlank(message = "Le code de la phase est obligatoire")
    public String code;

    @NotBlank(message = "Le libellé de la phase est obligatoire")
    public String libelle;



    public String description;

    @NotNull(message = "La date de début est obligatoire")
    public LocalDate dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    public LocalDate dateFin;
    @NotNull(message = "Le montant est obligatoire")
    public Double montant;

    public Boolean etatRealisation;

    public Boolean etatFacturation;

    public Boolean etatPaiement;

    public Long projetId;


}