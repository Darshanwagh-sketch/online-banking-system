package com.bank.config;

import com.bank.entity.Account;
import com.bank.entity.Role;
import com.bank.entity.User;
import com.bank.enums.AccountStatus;
import com.bank.enums.AccountType;
import com.bank.enums.RoleType;
import com.bank.repository.AccountRepository;
import com.bank.repository.RoleRepository;
import com.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Seed default system roles if absent
        for (RoleType roleType : RoleType.values()) {
            if (roleRepository.findByName(roleType).isEmpty()) {
                roleRepository.save(Role.builder().name(roleType).build());
            }
        }

        // Seed default Admin User if no admin exists
        Role adminRole = roleRepository.findByName(RoleType.ADMIN).orElseThrow();
        Role managerRole = roleRepository.findByName(RoleType.MANAGER).orElseThrow();
        Role staffRole = roleRepository.findByName(RoleType.STAFF).orElseThrow();
        Role customerRole = roleRepository.findByName(RoleType.CUSTOMER).orElseThrow();

        if (!userRepository.existsByEmail("admin@securebank.com")) {
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@securebank.com")
                    .phone("9998887770")
                    .password(passwordEncoder.encode("Admin@1234"))
                    .dateOfBirth(LocalDate.of(1990, 1, 1))
                    .address("Bank HQ, Financial District")
                    .enabled(true)
                    .roles(Set.of(adminRole))
                    .build();
            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("manager@securebank.com")) {
            User manager = User.builder()
                    .name("Branch Manager")
                    .email("manager@securebank.com")
                    .phone("9998887771")
                    .password(passwordEncoder.encode("Manager@1234"))
                    .dateOfBirth(LocalDate.of(1992, 5, 10))
                    .address("Branch Office, Sector 4")
                    .enabled(true)
                    .roles(Set.of(managerRole))
                    .build();
            userRepository.save(manager);
        }

        if (!userRepository.existsByEmail("staff@securebank.com")) {
            User staff = User.builder()
                    .name("Banking Staff")
                    .email("staff@securebank.com")
                    .phone("9998887772")
                    .password(passwordEncoder.encode("Staff@1234"))
                    .dateOfBirth(LocalDate.of(1995, 8, 20))
                    .address("Branch Office, Sector 4")
                    .enabled(true)
                    .roles(Set.of(staffRole))
                    .build();
            userRepository.save(staff);
        }

        if (!userRepository.existsByEmail("customer@securebank.com")) {
            User customer = User.builder()
                    .name("Demo Customer")
                    .email("customer@securebank.com")
                    .phone("9998887773")
                    .password(passwordEncoder.encode("Customer@1234"))
                    .dateOfBirth(LocalDate.of(1998, 12, 15))
                    .address("123 Main Street")
                    .enabled(true)
                    .roles(Set.of(customerRole))
                    .build();
            User savedCustomer = userRepository.save(customer);

            // Create initial account for demo customer
            if (accountRepository.findByUserId(savedCustomer.getId()).isEmpty()) {
                Account account = Account.builder()
                        .accountNumber("1001234567")
                        .user(savedCustomer)
                        .accountType(AccountType.SAVINGS)
                        .balance(new BigDecimal("50000.00"))
                        .currency("INR")
                        .status(AccountStatus.ACTIVE)
                        .build();
                accountRepository.save(account);
            }
        }
    }
}
