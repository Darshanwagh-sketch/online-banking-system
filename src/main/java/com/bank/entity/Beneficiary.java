package com.bank.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "beneficiaries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Beneficiary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String beneficiaryName;

    @Column(nullable = false, length = 20)
    private String accountNumber;

    @Column(length = 100)
    private String bankName;

    @Column(length = 20)
    private String ifscCode;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
