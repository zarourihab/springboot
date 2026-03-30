package com.example.suiviprojet.controller;

import com.example.suiviprojet.dto.PhaseDTO;
import com.example.suiviprojet.dto.ProjetDTO;
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
    public List<PhaseDTO> getPhasesTermineesNonFacturees() {
        return reportingService.getPhasesTermineesNonFacturees();
    }

    @GetMapping("/phases/facturees-non-payees")
    public List<PhaseDTO> getPhasesFactureesNonPayees() {
        return reportingService.getPhasesFactureesNonPayees();
    }

    @GetMapping("/phases/payees")
    public List<PhaseDTO> getPhasesPayees() {
        return reportingService.getPhasesPayees();
    }

    @GetMapping("/projets/en-cours")
    public List<ProjetDTO> getProjetsEnCours() {
        return reportingService.getProjetsEnCours();
    }

    @GetMapping("/projets/clotures")
    public List<ProjetDTO> getProjetsClotures() {
        return reportingService.getProjetsClotures();
    }

    @GetMapping("/tableau-de-bord")
    public Map<String, Object> getTableauDeBord() {
        return reportingService.getTableauDeBord();
    }
}
