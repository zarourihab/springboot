package com.example.suiviprojet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AffectationDTO {

    @NotNull(message = "L'id de l'employé est obligatoire")
    private Long employeId;

    @NotNull(message = "L'id de la phase est obligatoire")
    private Long phaseId;

    @NotBlank(message = "Le rôle est obligatoire")
    private String role;

    public AffectationDTO() {
    }

    public Long getEmployeId() {
        return employeId;
    }

    public void setEmployeId(Long employeId) {
        this.employeId = employeId;
    }

    public Long getPhaseId() {
        return phaseId;
    }

    public void setPhaseId(Long phaseId) {
        this.phaseId = phaseId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}