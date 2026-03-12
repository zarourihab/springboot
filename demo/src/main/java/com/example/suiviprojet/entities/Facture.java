package com.example.suiviprojet.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateFacture;

    private Boolean payee = false;

    @OneToOne
    private Phase phase;


    public Facture() {}


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDateFacture() { return dateFacture; }
    public void setDateFacture(LocalDate dateFacture) { this.dateFacture = dateFacture; }

    public Boolean getPayee() { return payee; }
    public void setPayee(Boolean payee) { this.payee = payee; }

    public Phase getPhase() { return phase; }
    public void setPhase(Phase phase) { this.phase = phase; }
}