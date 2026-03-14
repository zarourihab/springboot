package com.example.suiviprojet.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Entity
@Table(name = "organismes")
public class Organisme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le code est obligatoire")
    @Column(unique = true)
    private String code;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    private String adresse;
    private String telephone;

    private String nomContact;

    @Email(message = "Format d'email invalide")
    private String emailContact;

    private String siteWeb;

    @OneToMany(mappedBy = "organisme", cascade = CascadeType.ALL)
    private List<Projet> projets;

    public Organisme() {}


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getNomContact() { return nomContact; }
    public void setNomContact(String nomContact) { this.nomContact = nomContact; }


    public String getContact() { return nomContact; }
    public void setContact(String contact) { this.nomContact = contact; }

    public String getEmailContact() { return emailContact; }
    public void setEmailContact(String emailContact) { this.emailContact = emailContact; }

    public String getSiteWeb() { return siteWeb; }
    public void setSiteWeb(String siteWeb) { this.siteWeb = siteWeb; }

    public List<Projet> getProjets() { return projets; }
    public void setProjets(List<Projet> projets) { this.projets = projets; }
}