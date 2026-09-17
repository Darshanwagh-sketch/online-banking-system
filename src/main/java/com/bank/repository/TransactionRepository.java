package com.bank.repository;

import com.bank.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByTransactionReference(String reference);

    @Query("SELECT t FROM Transaction t WHERE t.fromAccount.id = :accountId OR t.toAccount.id = :accountId ORDER BY t.createdAt DESC")
    List<Transaction> findByAccountId(@Param("accountId") Long accountId);

    @Query("SELECT t FROM Transaction t WHERE t.fromAccount.user.id = :userId OR t.toAccount.user.id = :userId ORDER BY t.createdAt DESC")
    Page<Transaction> findByUserId(@Param("userId") Long userId, Pageable pageable);
}
