package com.example.suiviprojet.dto;

import java.time.LocalDate;

public class PhaseDTO {

    public Long id;

    public String code;

    public String libelle;

    public String description;

    public LocalDate dateDebut;

    public LocalDate dateFin;

    public Double montant;

    public Boolean etatRealisation;

    public Boolean etatFacturation;

    public Boolean etatPaiement;

    public Long projetId;

}