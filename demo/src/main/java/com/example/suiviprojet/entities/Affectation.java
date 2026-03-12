// Affectation.java
package com.example.suiviprojet.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "affectations")
public class Affectation {

    @EmbeddedId
    private AffectationId id;

    @ManyToOne
    @MapsId("employeId")
    @JoinColumn(name = "employe_id")
    private Employe employe;

    @ManyToOne
    @MapsId("phaseId")
    @JoinColumn(name = "phase_id")
    private Phase phase;


    private String role;

    public Affectation() {}

    public Affectation(Employe employe, Phase phase, String role) {
        this.employe = employe;
        this.phase = phase;
        this.role = role;
        this.id = new AffectationId(employe.getId(), phase.getId());
    }

    // Getters et Setters
    public AffectationId getId() {
        return id;
    }

    public void setId(AffectationId id) {
        this.id = id;
    }

    public Employe getEmploye() {
        return employe;
    }

    public void setEmploye(Employe employe) {
        this.employe = employe;
    }

    public Phase getPhase() {
        return phase;
    }

    public void setPhase(Phase phase) {
        this.phase = phase;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}