package com.abb.Abb.repository;

import com.abb.Abb.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    Optional<Client> findByRib(String rib);
    boolean existsByRib(String rib);
    Optional<Client> findByEmail(String senderEmail);
}
