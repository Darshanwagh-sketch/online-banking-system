package com.bank.service;

import com.bank.dto.BeneficiaryRequest;
import com.bank.dto.BeneficiaryResponse;
import com.bank.entity.Beneficiary;
import com.bank.entity.User;
import com.bank.exception.ResourceNotFoundException;
import com.bank.exception.UnauthorizedException;
import com.bank.repository.BeneficiaryRepository;
import com.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BeneficiaryServiceImpl implements BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public BeneficiaryResponse addBeneficiary(String email, BeneficiaryRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Beneficiary beneficiary = Beneficiary.builder()
                .user(user)
                .beneficiaryName(request.getBeneficiaryName())
                .accountNumber(request.getAccountNumber())
                .bankName(request.getBankName() != null ? request.getBankName() : "SecureBank")
                .ifscCode(request.getIfscCode() != null ? request.getIfscCode() : "SEC0001234")
                .build();

        Beneficiary savedBeneficiary = beneficiaryRepository.save(beneficiary);
        return mapToResponse(savedBeneficiary);
    }

    @Override
    public List<BeneficiaryResponse> getUserBeneficiaries(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        List<Beneficiary> beneficiaries = beneficiaryRepository.findByUserId(user.getId());
        return beneficiaries.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BeneficiaryResponse updateBeneficiary(String email, Long id, BeneficiaryRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Beneficiary beneficiary = beneficiaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary", "id", id));

        if (!beneficiary.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only modify your own beneficiaries");
        }

        beneficiary.setBeneficiaryName(request.getBeneficiaryName());
        beneficiary.setAccountNumber(request.getAccountNumber());
        if (request.getBankName() != null) beneficiary.setBankName(request.getBankName());
        if (request.getIfscCode() != null) beneficiary.setIfscCode(request.getIfscCode());

        Beneficiary updatedBeneficiary = beneficiaryRepository.save(beneficiary);
        return mapToResponse(updatedBeneficiary);
    }

    @Override
    @Transactional
    public void removeBeneficiary(String email, Long id) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Beneficiary beneficiary = beneficiaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary", "id", id));

        if (!beneficiary.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only delete your own beneficiaries");
        }

        beneficiaryRepository.delete(beneficiary);
    }

    private BeneficiaryResponse mapToResponse(Beneficiary beneficiary) {
        return BeneficiaryResponse.builder()
                .id(beneficiary.getId())
                .customerId(beneficiary.getUser().getId())
                .beneficiaryName(beneficiary.getBeneficiaryName())
                .accountNumber(beneficiary.getAccountNumber())
                .bankName(beneficiary.getBankName())
                .ifscCode(beneficiary.getIfscCode())
                .createdAt(beneficiary.getCreatedAt())
                .build();
    }
}
