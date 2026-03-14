package com.example.suiviprojet.mappers;

import com.example.suiviprojet.dto.OrganismeDTO;
import com.example.suiviprojet.entities.Organisme;
import org.springframework.stereotype.Component;

@Component
public class OrganismeMapper {
    public Organisme toEntity(OrganismeDTO dto) {
        Organisme organisme = new Organisme();
        organisme.setNom(dto.getNom());
        organisme.setAdresse(dto.getAdresse());
        organisme.setEmailContact(dto.getEmailContact());

        return organisme;
    }

    public OrganismeDTO toDTO(Organisme organisme) {
        OrganismeDTO dto = new OrganismeDTO();
        dto.setNom(organisme.getNom());
        dto.setAdresse(organisme.getAdresse());
        dto.setEmailContact(organisme.getEmailContact());

        return dto;
    }
}