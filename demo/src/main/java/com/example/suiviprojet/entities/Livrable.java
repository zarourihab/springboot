package com.example.suiviprojet.entities;

import jakarta.persistence.*;

@Entity
public class Livrable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String libelle;
    private String description;
    private String chemin;

    @ManyToOne
    private Phase phase;

    public Livrable() {}


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getChemin() { return chemin; }
    public void setChemin(String chemin) { this.chemin = chemin; }
    public Phase getPhase() { return phase; }
    public void setPhase(Phase phase) { this.phase = phase; }
}