package com.example.suiviprojet.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class FactureDTO {

    private Long id;

    @NotNull(message = "La date de facture est obligatoire")
    private LocalDate dateFacture;

    private Boolean payee;

    private Long phaseId;

    public FactureDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateFacture() {
        return dateFacture;
    }

    public void setDateFacture(LocalDate dateFacture) {
        this.dateFacture = dateFacture;
    }

    public Boolean getPayee() {
        return payee;
    }

    public void setPayee(Boolean payee) {
        this.payee = payee;
    }

    public Long getPhaseId() {
        return phaseId;
    }

    public void setPhaseId(Long phaseId) {
        this.phaseId = phaseId;
    }
}