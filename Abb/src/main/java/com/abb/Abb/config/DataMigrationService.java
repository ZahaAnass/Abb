package com.abb.Abb.config;

import com.abb.Abb.entity.Admin;
import com.abb.Abb.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataMigrationService implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public void run(String... args) throws Exception {
        if (adminRepository.count() == 0) {
            Admin defaultAdmin = new Admin();
            defaultAdmin.setName("System Admin");
            defaultAdmin.setEmail("admin@bank.com");

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
            defaultAdmin.setPassword(encoder.encode("admin123"));

            defaultAdmin.setRole("ADMIN");
            defaultAdmin.setCreationDate(LocalDateTime.now());

            adminRepository.save(defaultAdmin);

            System.out.println("✅Default Admin account created: admin@bank.com / admin123");
        }
    }
}