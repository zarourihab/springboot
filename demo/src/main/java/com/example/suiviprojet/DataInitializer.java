package com.example.suiviprojet;

import com.example.suiviprojet.entities.Employe;
import com.example.suiviprojet.entities.Profil;
import com.example.suiviprojet.repositories.EmployeRepository;
import com.example.suiviprojet.repositories.ProfilRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(
            ProfilRepository profilRepository,
            EmployeRepository employeRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {


            if (profilRepository.count() == 0) {

                Profil admin      = new Profil(); admin.setCode("ADMIN");       admin.setLibelle("Administrateur");
                Profil secretaire = new Profil(); secretaire.setCode("SECRETAIRE"); secretaire.setLibelle("Secrétaire");
                Profil directeur  = new Profil(); directeur.setCode("DIRECTEUR");   directeur.setLibelle("Directeur");
                Profil chefProjet = new Profil(); chefProjet.setCode("CHEF_PROJET"); chefProjet.setLibelle("Chef de projet");
                Profil comptable  = new Profil(); comptable.setCode("COMPTABLE");   comptable.setLibelle("Comptable");

                profilRepository.save(admin);
                profilRepository.save(secretaire);
                profilRepository.save(directeur);
                profilRepository.save(chefProjet);
                profilRepository.save(comptable);

                System.out.println("Profils créés : ADMIN, SECRETAIRE, DIRECTEUR, CHEF_PROJET, COMPTABLE");
            }


            if (employeRepository.findByLogin("admin").isEmpty()) {

                Profil adminProfil = profilRepository.findAll()
                        .stream()
                        .filter(p -> "ADMIN".equals(p.getCode()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Profil ADMIN introuvable"));

                Employe admin = new Employe();
                admin.setMatricule("EMP-001");
                admin.setNom("Admin");
                admin.setPrenom("Système");
                admin.setLogin("admin");
                admin.setEmail("admin@suivi.ma");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setProfil(adminProfil);

                employeRepository.save(admin);
                System.out.println(" Compte admin créé — login: admin / mot de passe: admin123");
            }
        };
    }
}