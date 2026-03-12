package com.example.suiviprojet.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class LigneEmployePhase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateDebut;
    private LocalDate dateFin;

    // Relation ManyToOne vers Employe [cite: 29, 31, 59]
    @ManyToOne
    private Employe employe;

    // Relation ManyToOne vers Phase [cite: 26, 29]
    @ManyToOne
    private Phase phase;

    public LigneEmployePhase() {}

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

    public Employe getEmploye() { return employe; }
    public void setEmploye(Employe employe) { this.employe = employe; }

    public Phase getPhase() { return phase; }
    public void setPhase(Phase phase) { this.phase = phase; }
}