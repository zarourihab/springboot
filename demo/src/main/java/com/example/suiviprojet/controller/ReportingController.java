package com.example.suiviprojet.controller;

import com.example.suiviprojet.entities.Phase;
import com.example.suiviprojet.entities.Projet;
import com.example.suiviprojet.service.ReportingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reporting")
public class ReportingController {

    private final ReportingService reportingService;

    public ReportingController(ReportingService reportingService) {
        this.reportingService = reportingService;
    }

    @GetMapping("/phases/terminees-non-facturees")
    public List<Phase> getPhasesTermineesNonFacturees() {
        return reportingService.getPhasesTermineesNonFacturees();
    }

    @GetMapping("/phases/facturees-non-payees")
    public List<Phase> getPhasesFactureesNonPayees() {
        return reportingService.getPhasesFactureesNonPayees();
    }

    @GetMapping("/phases/payees")
    public List<Phase> getPhasesPayees() {
        return reportingService.getPhasesPayees();
    }

    @GetMapping("/projets/en-cours")
    public List<Projet> getProjetsEnCours() {
        return reportingService.getProjetsEnCours();
    }

    @GetMapping("/projets/clotures")
    public List<Projet> getProjetsClotures() {
        return reportingService.getProjetsClotures();
    }

    @GetMapping("/tableau-de-bord")
    public Map<String, Object> getTableauDeBord() {
        return reportingService.getTableauDeBord();
    }
}