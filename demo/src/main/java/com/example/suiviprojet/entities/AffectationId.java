
package com.example.suiviprojet.entities;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class AffectationId implements Serializable {
    private Long employeId;
    private Long phaseId;

    public AffectationId() {}

    public AffectationId(Long employeId, Long phaseId) {
        this.employeId = employeId;
        this.phaseId = phaseId;
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

    // Equals et HashCode (OBLIGATOIRES)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AffectationId)) return false;
        AffectationId that = (AffectationId) o;
        return Objects.equals(employeId, that.employeId) && Objects.equals(phaseId, that.phaseId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(employeId, phaseId);
    }
}