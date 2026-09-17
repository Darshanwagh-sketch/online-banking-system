package com.bank.service;

import com.bank.dto.BeneficiaryRequest;
import com.bank.dto.BeneficiaryResponse;

import java.util.List;

public interface BeneficiaryService {
    BeneficiaryResponse addBeneficiary(String email, BeneficiaryRequest request);
    List<BeneficiaryResponse> getUserBeneficiaries(String email);
    BeneficiaryResponse updateBeneficiary(String email, Long id, BeneficiaryRequest request);
    void removeBeneficiary(String email, Long id);
}
