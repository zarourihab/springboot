package com.example.suiviprojet.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Livrable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Le code est obligatoire")
    private String code;

    @NotBlank(message = "Le libellé est obligatoire")
    private String libelle;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String chemin;

    @ManyToOne(fetch = FetchType.LAZY) // Optimisation : chargement différé
    @JoinColumn(name = "phase_id")     // Nom explicite de la colonne en base
    private Phase phase;

    public Livrable() {}

    // Constructeur utile pour vos tests ou services
    public Livrable(String code, String libelle, String description, String chemin, Phase phase) {
        this.code = code;
        this.libelle = libelle;
        this.description = description;
        this.chemin = chemin;
        this.phase = phase;
    }

    // Getters et Setters...
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