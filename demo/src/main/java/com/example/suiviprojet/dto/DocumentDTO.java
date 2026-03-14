package com.example.suiviprojet.dto;

import jakarta.validation.constraints.NotBlank;

public class DocumentDTO {

    public Long id;

    @NotBlank(message = "Le code est obligatoire")
    public String code;

    @NotBlank(message = "Le libellé est obligatoire")
    public String libelle;
    public String description;
    public String chemin;
    public Long projetId;

}