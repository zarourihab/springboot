package com.example.suiviprojet.repositories;

import com.example.suiviprojet.entities.Employe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EmployeRepository extends JpaRepository<Employe, Long> {

    Optional<Employe> findByMatricule(String matricule);
    Optional<Employe> findByLogin(String login);
    Optional<Employe> findByEmail(String email);

    List<Employe> findByNomContainingOrPrenomContainingOrMatriculeContainingOrLoginContainingOrEmailContaining(
            String nom, String prenom, String matricule, String login, String email);

    // Employés sans affectation à une phase qui chevauche la période demandée
    @Query("""
        SELECT e FROM Employe e
        WHERE e.id NOT IN (
            SELECT a.employe.id FROM Affectation a
            WHERE a.phase.dateDebut <= :dateFin
              AND a.phase.dateFin   >= :dateDebut
        )
    """)
    List<Employe> findDisponibles(@Param("dateDebut") LocalDate dateDebut,
                                  @Param("dateFin")   LocalDate dateFin);
}