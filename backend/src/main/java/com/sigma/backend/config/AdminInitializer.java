package com.sigma.backend.config;

import com.sigma.backend.entity.Admin;
import com.sigma.backend.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            if (adminRepository.findByUsername("admin").isEmpty()) {

                Admin admin = new Admin();

                admin.setUsername("admin");

                admin.setPassword(
                    passwordEncoder.encode("ChangeMe@123")
                );

                adminRepository.save(admin);

                System.out.println(
                    "================================="
                );

                System.out.println(
                    "Default admin account created"
                );

                System.out.println(
                    "Username: admin"
                );

                System.out.println(
                    "Password: ChangeMe@123"
                );

                System.out.println(
                    "================================="
                );
            }
        };
    }
}