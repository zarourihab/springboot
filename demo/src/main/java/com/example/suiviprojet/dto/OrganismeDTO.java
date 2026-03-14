package com.example.suiviprojet.dto;

public class OrganismeDTO {
    private String nom;
    private String adresse;
    private String emailContact;

    // Getters et Setters obligatoires
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getEmailContact() { return emailContact; }
    public void setEmailContact(String emailContact) { this.emailContact = emailContact; }
}