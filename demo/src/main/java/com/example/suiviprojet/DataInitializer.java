package com.example.suiviprojet;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.suiviprojet.repositories.ProjetRepository;
import com.example.suiviprojet.entities.Projet; // Assure-toi que cet import est correct

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(ProjetRepository projetRepo) {
        return args -> {
            System.out.println("--- ÉTAPE 3 : TEST DÉMARRÉ ---");

            // 1. Vérifier le nombre de projets existants
            long count = projetRepo.count();
            System.out.println("Nombre de projets en base : " + count);

            // 2. Si la base est vide, on ajoute un projet de test
            if (count == 0) {
                Projet p = new Projet();
                p.setNom("Projet Test Étape 3");
                // p.setDescription("Ceci est un projet de test pour vérifier la BDD");
                projetRepo.save(p);
                System.out.println("Projet de test inséré avec succès !");
            }

            // 3. Afficher tous les projets pour confirmer la lecture
            System.out.println("Liste des projets :");
            projetRepo.findAll().forEach(projet -> System.out.println(" - " + projet.getNom()));

            System.out.println("--- ÉTAPE 3 : TEST TERMINÉ ---");
        };
    }
}