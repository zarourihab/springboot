package com.example.suiviprojet.entities;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "phases")
public class Phase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String libelle;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Double montant;

    private boolean etatRealisation;
    private boolean etatFacturation;
    private boolean etatPaiement;

    @ManyToOne
    @JoinColumn(name = "projet_id")
    private Projet projet;

    @OneToMany(mappedBy = "phase", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Livrable> livrables;

    @OneToMany(mappedBy = "phase", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Affectation> affectations;

    @OneToOne(mappedBy = "phase", cascade = CascadeType.ALL, orphanRemoval = true)
    private Facture facture;

    public Phase() {}


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public boolean isEtatRealisation() { return etatRealisation; }
    public void setEtatRealisation(boolean etatRealisation) { this.etatRealisation = etatRealisation; }

    public boolean isEtatFacturation() { return etatFacturation; }
    public void setEtatFacturation(boolean etatFacturation) { this.etatFacturation = etatFacturation; }

    public boolean isEtatPaiement() { return etatPaiement; }
    public void setEtatPaiement(boolean etatPaiement) { this.etatPaiement = etatPaiement; }

    public Projet getProjet() { return projet; }
    public void setProjet(Projet projet) { this.projet = projet; }

    public List<Livrable> getLivrables() { return livrables; }
    public void setLivrables(List<Livrable> livrables) { this.livrables = livrables; }

    public List<Affectation> getAffectations() { return affectations; }
    public void setAffectations(List<Affectation> affectations) { this.affectations = affectations; }

    public Facture getFacture() { return facture; }
    public void setFacture(Facture facture) { this.facture = facture; }
}