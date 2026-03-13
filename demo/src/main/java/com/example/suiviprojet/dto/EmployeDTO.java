package com.example.suiviprojet.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class EmployeDTO {

    public Long id;

    @NotBlank(message = "Le matricule est obligatoire")
    public String matricule;

    @NotBlank(message = "Le nom est obligatoire")
    public String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    public String prenom;

    public String telephone;

    @Email(message = "Email invalide")
    public String email;

    @NotBlank(message = "Le login est obligatoire")
    public String login;

    public String password;

    public Long profilId;
}