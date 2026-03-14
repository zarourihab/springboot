package com.example.suiviprojet.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "employes")
public class Employe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String matricule;
    private String nom;
    private String prenom;
    private String telephone;
    private String email;
    private String login;
    private String password;

    @ManyToOne
    @JoinColumn(name = "profil_id")
    private Profil profil;

    @OneToMany(mappedBy = "employe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Affectation> affectations;

    public Employe() {}


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Profil getProfil() { return profil; }
    public void setProfil(Profil profil) { this.profil = profil; }

    public List<Affectation> getAffectations() { return affectations; }
    public void setAffectations(List<Affectation> affectations) { this.affectations = affectations; }
}