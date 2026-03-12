package com.example.suiviprojet.dto;
import jakarta.validation.constraints.NotBlank;
public class OrganismeDTO {
    public Long id;
    @NotBlank(message = "Le nom est obligatoire")
    public String nom;
    public String code;
    public String contact;
}