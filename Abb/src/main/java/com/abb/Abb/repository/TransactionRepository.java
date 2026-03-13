package com.abb.Abb.repository;

import com.abb.Abb.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySenderRibOrReceiverRib(String senderRib, String receiverRib);

    @Query(value = "SELECT * FROM transaction WHERE sender_rib = :rib OR receiver_rib = :rib ORDER BY transaction_date DESC LIMIT 5", nativeQuery = true)
    List<Transaction> findLast5Transactions(@Param("rib") String rib);

    List<Transaction> findBySenderRib(String senderRib);

    List<Transaction> findByReceiverRib(String receiverRib);

    Integer countBySenderRibOrReceiverRib(String senderRib, String receiverRib);
}