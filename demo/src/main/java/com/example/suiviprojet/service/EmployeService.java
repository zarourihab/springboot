package com.example.suiviprojet.service;

import com.example.suiviprojet.dto.EmployeDTO;
import com.example.suiviprojet.entities.Employe;
import com.example.suiviprojet.entities.Profil;
import com.example.suiviprojet.exceptions.BusinessException;
import com.example.suiviprojet.exceptions.ResourceNotFoundException;
import com.example.suiviprojet.repositories.EmployeRepository;
import com.example.suiviprojet.repositories.ProfilRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeService {

    private final PasswordEncoder passwordEncoder;
    private final EmployeRepository employeRepository;
    private final ProfilRepository profilRepository;

    public EmployeService(PasswordEncoder passwordEncoder, EmployeRepository employeRepository, ProfilRepository profilRepository) {
        this.passwordEncoder = passwordEncoder;
        this.employeRepository = employeRepository;
        this.profilRepository = profilRepository;

    }

    public EmployeDTO create(EmployeDTO dto) {
        verifierUnicite(dto, null);

        Employe employe = new Employe();
        mapDtoToEntity(dto, employe);

        employe = employeRepository.save(employe);
        return mapEntityToDto(employe);
    }

    public EmployeDTO findById(Long id) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé"));
        return mapEntityToDto(employe);
    }

    public List<EmployeDTO> findAll(String query) {
        List<Employe> employes;

        if (query != null && !query.isBlank()) {
            employes = employeRepository
                    .findByNomContainingOrPrenomContainingOrMatriculeContainingOrLoginContainingOrEmailContaining(
                            query, query, query, query, query
                    );
        } else {
            employes = employeRepository.findAll();
        }

        return employes.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    public EmployeDTO update(Long id, EmployeDTO dto) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé"));

        verifierUnicite(dto, id);
        mapDtoToEntity(dto, employe);

        employe = employeRepository.save(employe);
        return mapEntityToDto(employe);
    }

    public void delete(Long id) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé"));
        employeRepository.deleteById(id);
    }

    private void verifierUnicite(EmployeDTO dto, Long idEnCours) {
        employeRepository.findByMatricule(dto.matricule).ifPresent(e -> {
            if (idEnCours == null || !e.getId().equals(idEnCours)) {
                throw new BusinessException("Matricule déjà utilisé");
            }
        });

        employeRepository.findByLogin(dto.login).ifPresent(e -> {
            if (idEnCours == null || !e.getId().equals(idEnCours)) {
                throw new BusinessException("Login déjà utilisé");
            }
        });

        if (dto.email != null && !dto.email.isBlank()) {
            employeRepository.findByEmail(dto.email).ifPresent(e -> {
                if (idEnCours == null || !e.getId().equals(idEnCours)) {
                    throw new BusinessException("Email déjà utilisé");
                }
            });
        }
    }

    private void mapDtoToEntity(EmployeDTO dto, Employe employe) {
        employe.setMatricule(dto.matricule);
        employe.setNom(dto.nom);
        employe.setPrenom(dto.prenom);
        employe.setTelephone(dto.telephone);
        employe.setEmail(dto.email);
        employe.setLogin(dto.login);

        if (dto.password != null && !dto.password.isBlank()) {
            employe.setPassword(passwordEncoder.encode(dto.password));
        }

        if (dto.profilId != null) {
            Profil profil = profilRepository.findById(dto.profilId)
                    .orElseThrow(() -> new ResourceNotFoundException("Profil non trouvé"));
            employe.setProfil(profil);
        } else {
            employe.setProfil(null);
        }
    }

    private EmployeDTO mapEntityToDto(Employe employe) {
        EmployeDTO dto = new EmployeDTO();
        dto.id = employe.getId();
        dto.matricule = employe.getMatricule();
        dto.nom = employe.getNom();
        dto.prenom = employe.getPrenom();
        dto.telephone = employe.getTelephone();
        dto.email = employe.getEmail();
        dto.login = employe.getLogin();
        dto.profilId = employe.getProfil() != null ? employe.getProfil().getId() : null;
        return dto;
    }
}