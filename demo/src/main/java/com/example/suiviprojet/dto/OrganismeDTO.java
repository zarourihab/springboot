package com.example.suiviprojet.dto;

import jakarta.validation.constraints.NotBlank;

public class OrganismeDTO {
    private long id;
    @NotBlank(message = " Le code est obligatoire")
    private String code;
    private String nom;
    private String adresse;
    private String contact;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    private String emailContact;

    // Getters et Setters obligatoires
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getEmailContact() { return emailContact; }
    public void setEmailContact(String emailContact) { this.emailContact = emailContact; }
}