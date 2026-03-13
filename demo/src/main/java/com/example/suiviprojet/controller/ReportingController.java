package com.example.suiviprojet.controller;

import com.example.suiviprojet.entities.Phase;
import com.example.suiviprojet.service.ReportingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reporting")
public class ReportingController {

    private final ReportingService reportingService;

    public ReportingController(ReportingService reportingService) {
        this.reportingService = reportingService;
    }


    @GetMapping("/phases/terminees-non-facturees")
    public List<Phase> phasesTermineesNonFacturees() {
        return reportingService.phasesTermineesNonFacturees();
    }


    @GetMapping("/phases/facturees-non-payees")
    public List<Phase> phasesFactureesNonPayees() {
        return reportingService.phasesFactureesNonPayees();
    }


    @GetMapping("/phases/payees")
    public List<Phase> phasesPayees() {
        return reportingService.phasesPayees();
    }
}